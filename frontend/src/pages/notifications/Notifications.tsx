import { HiOutlineBell } from "react-icons/hi2";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function Notifications() {
  return (
    <ComingSoon
      eyebrow="Updates"
      title="Notifications"
      icon={<HiOutlineBell className="h-5 w-5" />}
      description="Activity on your listings and account will appear here."
    />
  );
}
