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
    if (!listingId || !otherUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getConversationHistory(listingId, otherUserId);

      setMessages(response.data);
      console.log("HISTORY ", JSON.stringify(response.data[0]));
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
    fetchHistory();
  }, [fetchHistory]);

  return { messages, setMessages, isLoading, error, retry: fetchHistory };
}
