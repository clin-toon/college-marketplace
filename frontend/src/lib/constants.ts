import type { Faculty, Semester } from "@/types/auth";
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineEnvelopeOpen,
} from "react-icons/hi2";

export const ALLOWED_EMAIL_DOMAIN = "oic.edu.np";

export const FACULTIES: { value: Faculty; label: string }[] = [
  { value: "BIM", label: "BIM — Bachelor in Information Management" },
  { value: "Bsc.CSIT", label: "BSc.CSIT — Computer Science & IT" },
  { value: "BBA", label: "BBA — Business Administration" },
  { value: "BBM", label: "BBM — Business Management" },
  { value: "BIT", label: "BIT — Information Technology" },
  { value: "B.TECH.AI", label: "B.Tech. AI — Artificial Intelligence" },
  { value: "BSW", label: "BSW — Social Work" },
];

export const SEMESTERS: Semester[] = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
];

export const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: HiOutlineHome },
  { to: "/listings", label: "Listings", icon: HiOutlineSquares2X2 },
  {
    to: "/my-listings",
    label: "My Listings",
    icon: HiOutlineClipboardDocumentList,
  },
  { to: "/favourites", label: "Favourites", icon: HiOutlineHeart },
  {
    to: "/contact-requests",
    label: "Contact Requests",
    icon: HiOutlineEnvelopeOpen,
  },
  { to: "/notifications", label: "Notifications", icon: HiOutlineBell },
];

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;

export type ListingSortValue = "latest" | "price_asc" | "price_desc";

export const LISTING_SORT_OPTIONS: {
  value: ListingSortValue;
  label: string;
  sortBy: "createdAt" | "price_asc" | "price_desc" | "latest";
  order: "asc" | "desc";
}[] = [
  { value: "latest", label: "Latest", sortBy: "latest", order: "desc" },
  {
    value: "price_asc",
    label: "Price: Low to High",
    sortBy: "price_asc",
    order: "asc",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
    sortBy: "price_desc",
    order: "desc",
  },
];
