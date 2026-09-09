import { z } from "zod";

export const conversationHistoryParamSchema = z.object({
  listingId: z.string().uuid("Invalid listing id"),
  otherUserId: z.string().uuid("Invalid user id"),
});

export const sendMessageSchema = z.object({
  listingId: z.string().min(1),
  receiverId: z.string().min(1),
  content: z.string().trim().min(1).max(2000),
  clientId: z.string().uuid(), // generated client-side, one per message attempt
});

export type ConversationHistoryParam = z.infer<
  typeof conversationHistoryParamSchema
>;
