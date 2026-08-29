import { HiOutlineEnvelopeOpen } from "react-icons/hi2";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function ContactRequests() {
  return (
    <ComingSoon
      eyebrow="Messages"
      title="Contact Requests"
      icon={<HiOutlineEnvelopeOpen className="h-5 w-5" />}
      description="Buyers reaching out about your listings will show up here."
    />
  );
}
