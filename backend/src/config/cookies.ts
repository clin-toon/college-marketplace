import { CookieOptions } from "express";
import { REFRESH_TOKEN_TTL_MS } from "../utils/token";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
};

export const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000, // 15 min, matches ACCESS_TOKEN_TTL
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  path: "/api/auth/refresh", // scope cookie so it's only ever sent to the refresh endpoint
  maxAge: REFRESH_TOKEN_TTL_MS,
};

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
