export type StreamHandlers = {
  onToken: (t: string) => void;
  onDone: () => void;
  onError?: (err: unknown) => void;
};

export function streamChat(
  workerUrl: string,
  body: unknown,
  { onToken, onDone, onError }: StreamHandlers,
  signal?: AbortSignal
) {
  (async () => {
    try {
      const res = await fetch(`${workerUrl}/chat2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE frames: "data: ....\n\n"
        let sep;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const frame = buffer.slice(0, sep).trim();
          buffer = buffer.slice(sep + 2);

          if (!frame.startsWith("data:")) continue;
          const payload = frame.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;

          // Workers AI may send JSON or raw text chunks
          try {
            const obj = JSON.parse(payload);
            const token =
              obj.delta ?? obj.response ?? obj.text ?? obj.token ?? "";
            if (token) onToken(token);
          } catch {
            onToken(payload);
          }
        }
      }
      onDone();
    } catch (err) {
      onError?.(err);
    }
  })();
}
