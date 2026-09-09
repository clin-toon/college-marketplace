import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/chat";

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  isOwn,
}: {
  message: ChatMessage;
  isOwn: boolean;
}) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
          isOwn
            ? "rounded-br-md bg-gradient-to-b from-brand-blue to-blue-700 text-white shadow-[0_4px_16px_-6px_rgba(59,130,246,0.5)]"
            : "rounded-bl-md border border-white/[0.08] bg-white/[0.03] text-app-text",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={cn(
            "mt-1 block text-[10.5px]",
            isOwn ? "text-red-600" : "text-app-text-muted/60",
          )}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
