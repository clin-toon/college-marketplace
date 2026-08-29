import { useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";

/**
 * Adjust the endpoint below to match your backend's contact-request route
 * once it's confirmed — the page component doesn't need to change.
 */
export function useContactSeller(listingId: string) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function sendRequest() {
    setIsSending(true);
    try {
      await apiClient.post(`/listings/${listingId}/contact-requests`);
      toast.success("Your contact request was sent to the seller.");
      setSent(true);
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsSending(false);
    }
  }

  return { isSending, sent, sendRequest };
}
