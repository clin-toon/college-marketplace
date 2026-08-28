import type { Faculty, Semester } from "@/types/auth";

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

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;
