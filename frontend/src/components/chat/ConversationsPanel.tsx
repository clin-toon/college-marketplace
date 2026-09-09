import { Link } from "react-router-dom";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { StatePanel } from "@/components/ui/StatePanel";
import { cn } from "@/lib/cn";
import type { ConversationSummary } from "@/types/chat";

interface ConversationsPanelProps {
  conversations: ConversationSummary[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
  activeListingId?: string;
  activeOtherUserId?: string;
}

export function ConversationsPanel({
  conversations,
  isLoading,
  error,
  retry,
  activeListingId,
  activeOtherUserId,
}: ConversationsPanelProps) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-white/[0.06] bg-surface-1/60">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h1 className="font-display text-[15px] font-semibold tracking-tight text-app-text">
          Messages
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex flex-col gap-1 p-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              >
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/[0.05]" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="p-3">
            <StatePanel
              icon={<HiOutlineExclamationTriangle className="h-4 w-4" />}
              title="Couldn't load messages"
              description={error}
              action={
                <button
                  onClick={retry}
                  className="mt-1 text-[12px] font-semibold text-cyan hover:underline"
                >
                  Try again
                </button>
              }
            />
          </div>
        )}

        {!isLoading && !error && conversations.length === 0 && (
          <div className="p-3">
            <StatePanel
              icon={<HiOutlineChatBubbleLeftRight className="h-4 w-4" />}
              title="No conversations yet"
              description="Message a seller to start one."
            />
          </div>
        )}

        {!isLoading &&
          !error &&
          conversations.map((conversation) => {
            const isActive =
              conversation.listingId === activeListingId &&
              conversation.otherUserId === activeOtherUserId;

            return (
              <Link
                key={`${conversation.listingId}-${conversation.otherUserId}`}
                to={`/messages/${conversation.listingId}/${conversation.otherUserId}`}
                state={{
                  listingTitle: conversation.listingTitle,
                  otherUserName: conversation.otherUserName,
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-surface-3 to-surface-2 font-display text-sm font-semibold text-cyan ring-1 ring-white/[0.08]">
                  {conversation.otherUserName.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-app-text">
                    {conversation.otherUserName}
                  </span>
                  <span className="block truncate text-[12px] text-app-text-muted">
                    {conversation.lastMessage}
                  </span>
                </span>
              </Link>
            );
          })}
      </div>
    </aside>
  );
}
