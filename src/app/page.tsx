"use client";

import { ChatWidget } from "@/components/ChatWidget";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

const WORKER_URL = "https://shy-water-63ef.marcialandres06.workers.dev";

const WORKER_ENDPOINT = {
  chat: `${WORKER_URL}/chat`,
  chat_two: `${WORKER_URL}/chat2`,
};

type Endpoints = keyof typeof WORKER_ENDPOINT

export default function Home() {
  const [workerUrl, setWorkerUrl] = useState(WORKER_ENDPOINT.chat);

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col gap-2">
        <h2>Endpoint Selection</h2>
        <Select defaultValue="chat" onValueChange={(value: Endpoints) => setWorkerUrl(WORKER_ENDPOINT[value])}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a chat endpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chat Endpoints</SelectLabel>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="chat_two">Chat 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ChatWidget workerUrl={workerUrl} />
    </div>
  );
}
