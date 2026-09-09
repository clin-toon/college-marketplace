import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { ConversationListItem } from "@/components/chat/ConversationsPanel";
import { StatePanel } from "@/components/ui/StatePanel";
import { useConversationsList } from "@/features/chat/hooks/useConversationsList";
import { useOpenChat } from "@/features/chat/hooks/useOpenChat";

export default function Messages() {
  const { conversations, isLoading, error, retry } = useConversationsList();
  const { openChat } = useOpenChat();

  return (
    <div className="mx-auto max-w-2xl px-8 py-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan">
          Inbox
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-app-text">
          Messages
        </h1>
        <p className="text-[14px] text-app-text-muted">
          Conversations with buyers and sellers about your listings.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5"
            >
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-white/[0.05]" />
              <div className="flex-1">
                <div className="h-3.5 w-32 animate-pulse rounded bg-white/[0.06]" />
                <div className="mt-2 h-3 w-48 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <StatePanel
          icon={<HiOutlineExclamationTriangle className="h-5 w-5" />}
          title="Couldn't load your messages"
          description={error}
          action={
            <button
              onClick={retry}
              className="mt-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-5 py-2 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-transform hover:-translate-y-0.5"
            >
              Try again
            </button>
          }
        />
      )}

      {!isLoading && !error && conversations.length === 0 && (
        <StatePanel
          icon={<HiOutlineChatBubbleLeftRight className="h-5 w-5" />}
          title="No conversations yet"
          description="Messages with buyers and sellers will show up here."
        />
      )}

      {!isLoading && !error && conversations.length > 0 && (
        <div className="glass-surface flex flex-col gap-1 rounded-2xl p-2">
          {conversations.map((conversation) => (
            <ConversationListItem
              key={`${conversation.listingId}-${conversation.otherUser.id}`}
              conversation={conversation}
              onClick={() =>
                openChat(conversation.listingId, conversation.otherUser.id, {
                  listingTitle: conversation.listingTitle,
                  listingImage: conversation.listingImage,
                  otherUserName: conversation.otherUser.fullName,
                  otherUserAvatar: conversation.otherUser.profileImageUrl,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
