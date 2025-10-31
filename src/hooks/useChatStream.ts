import { useRef, useState } from "react";
import { streamChat } from "@/lib/chatStream";

export function useChatStream(workerUrl: string) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  function send(
    userText: string,
    opts: {
      onToken: (t: string) => void;
      onDone?: () => void;
      system?: string;
      history?: { role: "user" | "assistant"; content: string }[];
    }
  ) {
    if (isStreaming) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    const messages = [
      ...(opts.system
        ? [{ role: "system" as const, content: opts.system }]
        : []),
      ...(opts.history ?? []),
      { role: "user" as const, content: userText },
    ];

    streamChat(
      workerUrl,
      { stream: true, messages },
      {
        onToken: opts.onToken,
        onDone: () => {
          setIsStreaming(false);
          opts.onDone?.();
        },
        onError: () => setIsStreaming(false),
      },
      controller.signal
    );
  }

  function abort() {
    abortRef.current?.abort();
    setIsStreaming(false);
  }

  return { isStreaming, send, abort };
}
