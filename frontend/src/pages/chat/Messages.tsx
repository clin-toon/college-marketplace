import { useParams } from "react-router-dom";
import { ConversationsPanel } from "@/components/chat/ConversationsPanel";
import { ChatThreadPanel } from "@/components/chat/ChatThreadPanel";
import { useConversationsList } from "@/features/chat/hooks/useConversationsList";

export default function Messages() {
  const { listingId, otherUserId } = useParams();
  const { conversations, isLoading, error, retry } = useConversationsList();

  const activeConversation = conversations.find(
    (c) => c.listingId === listingId && c.otherUserId === otherUserId,
  );

  return (
    <div className="flex h-screen">
      <ConversationsPanel
        conversations={conversations}
        isLoading={isLoading}
        error={error}
        retry={retry}
        activeListingId={listingId}
        activeOtherUserId={otherUserId}
      />
      <ChatThreadPanel
        listingId={listingId}
        otherUserId={otherUserId}
        conversation={activeConversation}
      />
    </div>
  );
}
