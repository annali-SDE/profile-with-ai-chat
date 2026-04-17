"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const STARTER_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I am Anna's digital twin. Ask me anything about her career journey, skills, or the kind of engineering impact she can bring."
  }
];

const SUGGESTED_PROMPTS = [
  "What type of roles is Anna best suited for?",
  "Tell me about her experience at INRIX.",
  "What are her strongest technical skills?"
];

export default function DigitalTwinChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  async function sendMessage(text: string) {
    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    if (!userMessage.content) return;

    setError(null);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const payloadMessages = [...messages, userMessage];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: payloadMessages })
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
      };
      const reply = data.reply;

      if (!response.ok || typeof reply !== "string" || reply.trim().length === 0) {
        const message =
          data.error ?? "Sorry, I could not answer right now. Please try again.";
        setError(message);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply
        }
      ]);
    } catch {
      setError("Network issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    void sendMessage(input);
  }

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <p className="eyebrow">DIGITAL TWIN CHAT</p>
        <h3>Ask Anna&apos;s AI career assistant</h3>
      </div>

      <div className="chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`chat-bubble ${message.role === "user" ? "user" : "assistant"}`}
          >
            <p className="chat-role">{message.role === "user" ? "You" : "Anna AI"}</p>
            <p>{message.content}</p>
          </article>
        ))}

        {isLoading ? (
          <article className="chat-bubble assistant">
            <p className="chat-role">Anna AI</p>
            <p>Thinking...</p>
          </article>
        ) : null}
      </div>

      <div className="chat-prompts">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="prompt-chip"
            onClick={() => void sendMessage(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={onSubmit}>
        <label htmlFor="chatInput" className="sr-only">
          Ask Anna&apos;s digital twin
        </label>
        <input
          id="chatInput"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Anna's experience, stack, or career fit..."
        />
        <button type="submit" className="btn btn-primary" disabled={!canSend}>
          Send
        </button>
      </form>

      {error ? <p className="chat-error">{error}</p> : null}
    </div>
  );
}
