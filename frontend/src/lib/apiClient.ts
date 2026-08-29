import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_BASE_API;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip the automatic error toast (e.g. when a hook wants to handle it itself). */
  silent?: boolean;
}

/**
 * Centralized request handler. Every API call in the app goes through here,
 * so auth (cookie-based access token), JSON headers, and error handling
 * only need to be correct in one place.
 */
async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, silent, headers, ...rest } = options;

  let response: Response;
  console.log(`${API_BASE_URL}${path}`);
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: "include", // sends the httpOnly access-token cookie
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const message = "Can't reach the server. Check your connection.";
    if (!silent) toast.error(message);
    throw new ApiError(0, message);
  }

  // Session expired or not authenticated — send the user back to log in.
  if (response.status === 401) {
    const message = "Your session has expired. Please log in again.";
    if (!silent) toast.error(message);
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
    }
    throw new ApiError(401, message);
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    // No JSON body (e.g. 204) — that's fine for non-GET responses.
  }

  const parsed = payload as { message?: string; success?: boolean } | null;

  if (!response.ok) {
    const message =
      parsed?.message ?? `Something went wrong (${response.status}).`;
    if (!silent) toast.error(message);
    throw new ApiError(response.status, message);
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
