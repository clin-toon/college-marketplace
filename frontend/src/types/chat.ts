/**
 * Matches the backend's saved-message shape: `saveMessage({ listingId, senderId,
 * receiverId, content })`. `id`/`createdAt` are assumed field names — adjust
 * here if your DB row uses different ones.
 */
export interface ChatMessage {
  message_id: string;
  listingId: string;
  sender_id: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

/** One row from GET /messages/conversations — flat shape, confirmed from the real response. */
export interface ConversationSummary {
  listingId: string;
  listingTitle: string;
  otherUserId: string;
  otherUserName: string;
  otherUserEmail: string;
  lastMessage: string;
  lastMessageAt: string;
}

export interface ConversationsResponse {
  success: boolean;
  data: ConversationSummary[];
}

export interface MessagesResponse {
  success: boolean;
  data: ChatMessage[];
}
