import { HiOutlineHome } from "react-icons/hi2";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function Home() {
  return (
    <ComingSoon
      eyebrow="Overview"
      title="Home"
      icon={<HiOutlineHome className="h-5 w-5" />}
      description="Your activity summary — recent buys, overall buy/sell stats — lands here next."
    />
  );
}
