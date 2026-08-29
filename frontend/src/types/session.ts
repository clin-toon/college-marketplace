import type { AuthUser } from "@/types/auth";

export type { AuthUser };

export interface SessionResponse {
  success: boolean;
  data: AuthUser;
}
