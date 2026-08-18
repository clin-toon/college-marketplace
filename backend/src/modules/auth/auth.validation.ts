import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required.")
    .max(15, "Full name must be less than 30 characters."),

  email: z.string().email("Invalid email address."),

  phoneNumber: z
    .string()
    .regex(
      /^9\d{9}$/,
      "Phone number must be exactly 10 digits and start with 9.",
    ),

  faculty: z
    .string()
    .min(1, "Faculty is required.")
    .max(7, "Faculty must be at most 7 characters long."),

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

export type RegistrationInput = z.infer<typeof registrationSchema>;
