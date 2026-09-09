import { useState } from "react";
import toast from "react-hot-toast";
import { updateListingStatus } from "@/features/my-listings/api/myListingsApi";
import type { ListingStatus } from "@/types/listing";

export function useUpdateListingStatus(
  listingId: string,
  initialStatus: ListingStatus,
) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function changeStatus(nextStatus: ListingStatus) {
    if (nextStatus === status) return;
    const previous = status;
    setStatus(nextStatus);
    setIsUpdating(true);
    try {
      await updateListingStatus(listingId, nextStatus);
      toast.success(`Marked as ${nextStatus}.`);
    } catch {
      setStatus(previous);
      toast.error("Couldn't update status. Try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return { status, isUpdating, changeStatus };
}
