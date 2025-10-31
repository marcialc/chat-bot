"use client";

import type React from "react";

import { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, XIcon, MessageCircleIcon } from "@/components/icons";
import { useChatStream } from "@/hooks/useChatStream";
import { ChatMessage } from "./ChatMessage";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWidgetProps {
  workerUrl: string
}

export const ChatWidget = ({ workerUrl }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { isStreaming, send } = useChatStream(workerUrl);

  const handleSend = () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };
    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    const history = messages.map(({ role, content }) => ({ role, content }));
    const pending = inputValue;
    setInputValue("");

    send(pending, {
      history,
      onToken: (t) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + t } : m
          )
        ),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
        className="fixed bottom-5 right-5 h-fit w-fit p-3 rounded-full bg-teal-600 shadow-lg hover:bg-teal-700 transition-all duration-200 hover:scale-110"
        size="icon"
      >
        {isOpen ? (
          <XIcon className="size-6" />
        ) : (
          <MessageCircleIcon className="size-6" />
        )}
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className={`fixed ${
            isExpanded
              ? "inset-0"
              : "bottom-24 right-5 h-[600px] w-[400px] max-sm:inset-0"
          } z-50 transition-all duration-300`}
        >
          <div className="h-full w-full flex flex-col bg-gray-900 border border-gray-800 rounded-lg shadow-2xl max-sm:rounded-none">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-3 rounded-t-lg max-sm:rounded-none">
              <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setIsExpanded((prevIsExpanded) => !prevIsExpanded)
                  }
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                  }}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-800 bg-gray-950 p-4 rounded-b-lg max-sm:rounded-none">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-teal-600"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <SendIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
