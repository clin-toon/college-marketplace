const API_BASE = "http://localhost:3000/api/v1";

/**
 * Checks if the user has a valid session by hitting /auth/me.
 * Cookies are sent automatically since they're same-site/credentials included.
 * Redirects to login if not authenticated. Call this at the top of every
 * protected page.
 */

export async function requireAuth() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data.user;
    }

    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return requireAuth(); // retry /me once, now that tokens are fresh
      }
    }

    redirectToLogin();
    return null;
  } catch (err) {
    console.error("Auth check failed:", err);
    redirectToLogin();
    return null;
  }
}

export async function tryRefresh() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

function redirectToLogin() {
  const currentPath = window.location.pathname;
  window.location.href = `/frontend/pages/login.html?redirect=${encodeURIComponent(currentPath)}`;
}
