import crypto from "crypto";
import bcrypt from "bcrypt";

export const validateEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith("@oic.edu.np");
};

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
