import { useCallback, useEffect, useState } from "react";
import { getConversationHistory } from "@/features/chat/api/chatApt";
import { ApiError } from "@/lib/apiClient";
import type { ChatMessage } from "@/types/chat";

export function useConversationHistory(
  listingId: string | undefined,
  otherUserId: string | undefined,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getConversationHistory(
        listingId as string,
        otherUserId as string,
      );

      setMessages(response.data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load this conversation. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [listingId, otherUserId]);

  useEffect(() => {
    if (!listingId || !otherUserId) {
      return;
    }
    fetchHistory();
  }, [fetchHistory]);

  return { messages, setMessages, isLoading, error, retry: fetchHistory };
}
