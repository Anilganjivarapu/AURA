import { useMemo, useState } from "react";

const topics = [
  { key: "coding", label: "Coding Questions" },
  { key: "resume", label: "Resume Tips" },
  { key: "interview", label: "Interview Questions" },
  { key: "courses", label: "Course Guidance" },
  { key: "support", label: "Support FAQs" },
];

const providers = [
  { key: "openai", label: "OpenAI" },
  { key: "gemini", label: "Gemini" },
];

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString();
};

const ChatPanel = ({ onSend, loading, history, provider, topic, onProviderChange, onTopicChange, error }) => {
  const [prompt, setPrompt] = useState("");

  const conversation = useMemo(
    () =>
      history.flatMap((entry) => [
        { role: "user", content: entry.prompt, createdAt: entry.createdAt, topic: entry.topic },
        { role: "assistant", content: entry.response, createdAt: entry.createdAt, topic: entry.topic, provider: entry.provider },
      ]),
    [history]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    const success = await onSend({ prompt, provider, topic });

    if (success) {
      setPrompt("");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <div className="space-y-6">
        <div className="glass-panel p-5">
          <p className="text-xs uppercase tracking-[0.32em] text-aura-gold">AI Provider</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {providers.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onProviderChange(item.key)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  provider === item.key ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5">
          <p className="text-xs uppercase tracking-[0.32em] text-aura-gold">Ask About</p>
          <div className="mt-4 grid gap-3">
            {topics.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onTopicChange(item.key)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  topic === item.key ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-5">
          <h3 className="font-display text-2xl text-white">AURA AI Assistant</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Ask coding doubts, get resume tips, practice interviews, find course guidance, or resolve support queries.
          </p>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows="8"
            className="field-shell mt-5 w-full"
            placeholder="Type your question here..."
          />
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}
          <button type="submit" className="primary-button mt-4 w-full" disabled={loading}>
            {loading ? "Generating response..." : "Ask AURA AI"}
          </button>
        </form>
      </div>

      <div className="glass-panel flex min-h-[680px] flex-col overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.32em] text-aura-gold">Chat History</p>
          <h3 className="mt-2 font-display text-3xl text-white">Saved conversations</h3>
        </div>
        <div className="aura-scrollbar flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {conversation.length ? (
            conversation.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-[24px] border p-5 ${
                  message.role === "assistant"
                    ? "border-aura-gold/20 bg-aura-gold/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-aura-gold">
                    {message.role === "assistant" ? `${message.provider} assistant` : message.topic}
                  </p>
                  <p className="text-xs text-slate-400">{formatTime(message.createdAt)}</p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-100">{message.content}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 p-6 text-sm text-slate-300">
              No chat history yet. Your successful AI conversations will be stored in MongoDB here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
