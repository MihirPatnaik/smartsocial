// components/ChatBox.tsx
import React, { useState } from "react";
import { askDevAssistant } from "../utils/openai";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");

    const response = await askDevAssistant(input);
    setMessages((prev) => [...prev, { sender: "GPT", text: response }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">
          💻 Local GPT-3.5 Assistant
        </h2>
        <div className="h-96 overflow-y-auto border p-4 rounded mb-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-bold">{msg.sender === "You" ? "🧑‍💻 You:" : "🤖 GPT:"}</span> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-4 py-2"
            placeholder="Type your prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
