export type Faculty =
  | "BIM"
  | "Bsc.CSIT"
  | "BBA"
  | "BBM"
  | "BIT"
  | "B.TECH.AI"
  | "BSW";

export type Semester = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII";

export type UserRole = "public" | "user" | "admin";

export interface SignupPayload {
  fullName: string;
  email: string;
  faculty: Faculty;
  phoneNumber: string;
  semester: Semester;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  faculty: Faculty;
  semester: Semester;
  role: UserRole;
}

/** Shape every auth API call resolves to, success or failure. */
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message: string;
}
