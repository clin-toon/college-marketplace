import type {
  ApiResult,
  AuthUser,
  LoginPayload,
  OtpPayload,
  SignupPayload,
} from "@/types/auth";

const base_api = import.meta.env.VITE_BASE_API;
const NETWORK_DELAY_MS = 1100;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function signupRequest(
  payload: SignupPayload,
): Promise<ApiResult<{ email: string }>> {
  const response = await fetch(`${base_api}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || "Registration failed");
    throw error;
  }

  return result;
}

export async function loginRequest(
  payload: LoginPayload,
): Promise<ApiResult<AuthUser>> {
  const response = await fetch(`${base_api}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Registration failed");
    throw error;
  }

  return result;
}

export async function verifyOtpRequest(
  payload: OtpPayload,
): Promise<ApiResult<{ verified: true }>> {
  const response = await fetch(`${base_api}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || "Registration failed");
    throw error;
  }

  return result;
}

export async function resendOtpRequest(
  email: string,
): Promise<ApiResult<null>> {
  console.log(email);
  const response = await fetch(`${base_api}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || "Registration failed");
    throw error;
  }

  return result;
}
