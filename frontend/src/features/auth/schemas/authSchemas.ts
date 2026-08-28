import { z } from "zod";
import { ALLOWED_EMAIL_DOMAIN, OTP_LENGTH } from "@/lib/constants";

/** Text-only, max 50 characters. Allows spaces, hyphens, and apostrophes for names. */
const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Full name is required")
  .max(50, "Full name must be 50 characters or fewer")
  .regex(
    /^[A-Za-z][A-Za-z\s'-]*$/,
    "Full name can only contain letters, spaces, hyphens and apostrophes",
  );

/** Must be an @oic.edu.np address. */
const collegeEmailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .refine(
    (value) => value.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`),
    `Email must be a college address ending in @${ALLOWED_EMAIL_DOMAIN}`,
  );

/** At least 8 characters, must contain both letters and numbers. */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(15, "Password cannot exceed 15 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

const facultySchema = z.enum(
  ["BIM", "Bsc.CSIT", "BBA", "BBM", "BIT", "B.TECH.AI", "BSW"],
  { message: "Select your faculty" },
);

const semesterSchema = z.enum(
  ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
  { message: "Select your semester" },
);

const phoneSchema = z
  .string()
  .regex(/^9\d{9}$/, "Phone number must be exactly 10 digits and start with 9");

export const signupSchema = z
  .object({
    fullName: fullNameSchema,
    email: collegeEmailSchema,
    faculty: facultySchema,
    phoneNumber: phoneSchema,
    semester: semesterSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: collegeEmailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
