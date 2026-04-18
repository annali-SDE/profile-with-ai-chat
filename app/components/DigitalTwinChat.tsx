"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

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
  "Give me a quick summary of her career journey.",
  "How can Anna add value in the first 90 days?",
  "What are her strongest technical skills?"
];

export default function DigitalTwinChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSentAt, setLastSentAt] = useState<string>("Just now");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    if (!userMessage.content) return;

    setError(null);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setLastSentAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

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

  function onInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!canSend) return;
      void sendMessage(input);
    }
  }

  return (
    <div className="chat-widget">
      <div className="chat-widget-header">
        <div className="chat-title-group">
          <div className="chat-avatar">AL</div>
          <div>
            <p className="eyebrow">DIGITAL TWIN CHAT</p>
            <h3>Anna AI Career Copilot</h3>
          </div>
        </div>
        <p className="chat-status">
          <span aria-hidden="true" /> Online
        </p>
      </div>

      <div className="chat-suggestion-grid">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="chat-suggestion-card"
            onClick={() => void sendMessage(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="chat-thread" aria-live="polite">
        <p className="chat-thread-meta">Last message sent at {lastSentAt}</p>
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`chat-message-row ${message.role === "user" ? "user" : "assistant"}`}
          >
            <div className={`chat-bubble ${message.role === "user" ? "user" : "assistant"}`}>
              <p className="chat-role">{message.role === "user" ? "You" : "Anna AI"}</p>
              <p>{message.content}</p>
            </div>
          </article>
        ))}
        {isLoading ? (
          <article className="chat-message-row assistant">
            <div className="chat-bubble assistant">
              <p className="chat-role">Anna AI</p>
              <p className="chat-typing">
                <span />
                <span />
                <span />
              </p>
            </div>
          </article>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-composer" onSubmit={onSubmit}>
        <label htmlFor="chatInput" className="sr-only">
          Ask Anna&apos;s digital twin
        </label>
        <textarea
          id="chatInput"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Ask about Anna's experience, impact, or role fit..."
          rows={1}
        />
        <button type="submit" className="chat-send-btn" disabled={!canSend}>
          {isLoading ? "..." : "Send"}
        </button>
      </form>

      {error ? <p className="chat-error">{error}</p> : null}
    </div>
  );
}
