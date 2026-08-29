import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function MyListings() {
  return (
    <ComingSoon
      eyebrow="Manage"
      title="My Listings"
      icon={<HiOutlineClipboardDocumentList className="h-5 w-5" />}
      description="Create, edit, and remove your own listings from here."
    />
  );
}
