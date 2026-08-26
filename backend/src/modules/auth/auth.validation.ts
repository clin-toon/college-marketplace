import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z
    .string()
    .regex(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/, "Invalid full name ")
    .min(1, "Full name is required.")
    .max(50, "Full name must be less than 30 characters."),

  email: z
    .string()
    .trim()
    .max(254, "Email is too long")
    .email("Invalid email address")
    .refine((email) => {
      const domain = email.split("@")[1]?.toLowerCase();

      if (!domain) return false;

      const parts = domain.split(".");

      if (
        parts.length >= 3 &&
        parts[parts.length - 1] === parts[parts.length - 2]
      ) {
        return false;
      }

      return true;
    }, "Invalid email domain"),
  phoneNumber: z
    .string()
    .regex(
      /^9\d{9}$/,
      "Phone number must be exactly 10 digits and start with 9.",
    ),

  faculty: z.enum(["bsc.csit", "bim", "bba", "bbm", "bsw", "bit", "btech ai"]),

  semester: z
    .string()
    .min(1, "Semester is required.")
    .max(8, "Semester must less than 7 chracters."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(15, "Password cannot exceed 15 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
