import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { StatePanel } from "@/components/ui/StatePanel";
import { useConversationHistory } from "@/features/chat/hooks/useConversationHistory";
import { useChatSocket } from "@/features/chat/hooks/useChatSocket";
import { useAuth } from "@/context/AuthContext";
import type { ChatMessage, ConversationSummary } from "@/types/chat";

interface ChatLocationState {
  listingTitle?: string;
  otherUserName?: string;
}

interface ChatThreadPanelProps {
  listingId?: string;
  otherUserId?: string;
  conversation?: ConversationSummary;
}

export function ChatThreadPanel({
  listingId,
  otherUserId,
  conversation,
}: ChatThreadPanelProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navState = (location.state as ChatLocationState | null) ?? {};
  const headerName = conversation?.otherUserName ?? navState.otherUserName;
  const headerListingTitle =
    conversation?.listingTitle ?? navState.listingTitle;

  const { messages, setMessages, isLoading, error, retry } =
    useConversationHistory(listingId, otherUserId);

  function handleIncomingMessage(message: ChatMessage) {
    setMessages((prev) =>
      prev.some((m) => m.message_id === message.message_id)
        ? prev
        : [...prev, message],
    );
  }

  const { isConnected, isJoined, sendMessage } = useChatSocket(
    listingId ?? "",
    otherUserId ?? "",
    handleIncomingMessage,
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  if (!listingId || !otherUserId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StatePanel
          icon={<HiOutlineChatBubbleLeftRight className="h-5 w-5" />}
          title="Select a conversation"
          description="Choose a conversation from the list to view messages."
        />
      </div>
    );
  }

  const canSend = isConnected && isJoined;

  return (
    <div className="flex h-full flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-surface-1/60 px-6 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-surface-3 to-surface-2 font-display text-sm font-semibold text-cyan ring-1 ring-white/[0.08]">
          {(headerName ?? "?").charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold tracking-tight text-app-text">
            {headerName ?? "Conversation"}
          </p>
          {headerListingTitle && (
            <p className="truncate text-[12px] text-app-text-muted">
              Re: {headerListingTitle}
            </p>
          )}
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            canSend
              ? "bg-teal/15 text-teal ring-1 ring-teal/25"
              : "bg-white/[0.06] text-app-text-muted ring-1 ring-white/[0.1]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${canSend ? "bg-teal" : "bg-app-text-muted"}`}
          />
          {canSend ? "Live" : "Connecting…"}
        </span>
      </div>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-1 items-center justify-center px-6">
          <StatePanel
            icon={<HiOutlineExclamationTriangle className="h-5 w-5" />}
            title="Couldn't load this conversation"
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
        </div>
      )}

      {!isLoading && !error && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <StatePanel
                icon={<HiOutlineChatBubbleLeftRight className="h-5 w-5" />}
                title="Say hello"
                description={
                  headerListingTitle
                    ? `Start the conversation about "${headerListingTitle}".`
                    : "Start the conversation."
                }
              />
            </div>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-3">
              {messages.map((message) => (
                <MessageBubble
                  key={message.message_id}
                  message={message}
                  isOwn={message.sender_id === user?.userId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && (
        <ChatComposer onSend={sendMessage} disabled={!canSend} />
      )}
    </div>
  );
}
