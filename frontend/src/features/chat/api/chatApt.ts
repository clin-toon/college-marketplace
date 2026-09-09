import { apiClient } from "@/lib/apiClient";
import type { ConversationsResponse, MessagesResponse } from "@/types/chat";

export function getConversations() {
  return apiClient.get<ConversationsResponse>("/messages/conversations");
}

export function getConversationHistory(listingId: string, otherUserId: string) {
  return apiClient.get<MessagesResponse>(
    `/messages/${listingId}/${otherUserId}`,
  );
}
