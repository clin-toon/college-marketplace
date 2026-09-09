import { useCallback, useEffect, useState } from "react";
import { getConversations } from "@/features/chat/api/chatApt";
import { ApiError } from "@/lib/apiClient";
import type { ConversationSummary } from "@/types/chat";

export function useConversationsList() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getConversations();
      console.log(response.data);
      setConversations(response.data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't load your messages.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, isLoading, error, retry: fetchConversations };
}
