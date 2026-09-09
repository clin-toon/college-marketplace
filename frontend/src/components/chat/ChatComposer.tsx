import { useState, type KeyboardEvent } from "react";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [text, setText] = useState("");

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2.5 border-t border-white/[0.06] bg-surface-1/80 px-4 py-3 backdrop-blur-xl">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a message…"
        rows={1}
        disabled={disabled}
        className="max-h-32 flex-1 resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-[14px] text-app-text placeholder:text-app-text-muted/50 outline-none transition-colors focus:border-cyan/40 focus:ring-4 focus:ring-cyan/10 disabled:opacity-60"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <HiOutlinePaperAirplane className="h-4 w-4" />
      </button>
    </div>
  );
}
