import { useState } from "react";
import toast from "react-hot-toast";
import { adminListingsApi } from "../api/adminListingsApt";
import type { ListingSummary } from "../types/adminListing.types";

export type ListingAction =
  | "hide"
  | "show"
  | "status"
  | "mark-sold"
  | "mark-removed";

export type StatusType = "active" | "sold" | "reserved" | "removed";

export function useListingActions(
  updateListingLocal: (id: string, patch: Partial<ListingSummary>) => void,
) {
  const [pendingAction, setPendingAction] = useState<{
    listing: ListingSummary;
    action: ListingAction;
    newStatus?: StatusType;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestAction = (
    listing: ListingSummary,
    action: ListingAction,
    newStatus?: StatusType,
  ) => setPendingAction({ listing, action, newStatus });

  const cancelAction = () => setPendingAction(null);

  const confirmAction = async () => {
    if (!pendingAction) return;
    const { listing, action, newStatus } = pendingAction;
    setIsSubmitting(true);
    try {
      let newListingStatus: string | undefined;
      if (action === "hide") {
        await adminListingsApi.hideListing(listing.listingId);
        newListingStatus = "hidden";
      } else if (action === "show") {
        await adminListingsApi.showListing(listing.listingId);
        newListingStatus = "active";
      } else {
        await adminListingsApi.setListingStatus(listing.listingId, newStatus!);
        newListingStatus = newStatus;
      }
      if (newListingStatus) {
        updateListingLocal(listing.listingId, { status: newListingStatus });
      }
      toast.success(
        action === "hide"
          ? `"${listing.title}" is now hidden.`
          : action === "show"
            ? `"${listing.title}" is now visible.`
            : `"${listing.title}" status changed to ${newStatus}.`,
      );
      setPendingAction(null);
    } catch {
      // apiClient already toasted the failure
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    pendingAction,
    isSubmitting,
    requestAction,
    cancelAction,
    confirmAction,
  };
}
