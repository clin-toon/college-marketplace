export const ROLES = ["student", "admin", "moderator"] as const; // adjust to your actual roles
export type Role = (typeof ROLES)[number];

export interface UserRow {
  user_id: string;
  email: string;
  hashed_password: string;
  role: Role;
  is_verified: boolean;
}
