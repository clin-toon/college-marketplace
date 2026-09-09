import { useNavigate } from "react-router-dom";

interface ChatContext {
  listingTitle?: string;

  otherUserName?: string;
}

export function useOpenChat() {
  const navigate = useNavigate();

  function openChat(
    listingId: string,
    otherUserId: string,
    context?: ChatContext,
  ) {
    navigate(`/messages/${listingId}/${otherUserId}`, { state: context });
  }

  return { openChat };
}
