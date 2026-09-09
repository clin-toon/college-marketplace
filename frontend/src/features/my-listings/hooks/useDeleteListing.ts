import { useState } from "react";
import toast from "react-hot-toast";
import { deleteListing } from "@/features/my-listings/api/myListingsApi";

export function useDeleteListing(onDeleted: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function remove(listingId: string) {
    setIsDeleting(true);
    try {
      await deleteListing(listingId);
      toast.success("Listing deleted.");
      onDeleted();
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsDeleting(false);
    }
  }

  return { isDeleting, remove };
}
