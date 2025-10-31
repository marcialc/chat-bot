import ReactMarkdown from "react-markdown";
import { Message } from "./ChatWidget";

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      key={message.id}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.role === "user"
            ? "bg-teal-600 text-white"
            : "bg-gray-800 text-gray-100"
        }`}
      >
        <ReactMarkdown
          // className="text-sm leading-relaxed"
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  message.role === "user"
                    ? "text-white hover:text-gray-200"
                    : "text-teal-400 hover:text-teal-300"
                }`}
              />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
