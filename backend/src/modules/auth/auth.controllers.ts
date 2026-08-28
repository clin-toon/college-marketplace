import { generateOtp, validateEmail } from "./auth.helpers";
import { Request, RequestHandler, Response, NextFunction } from "express";
import {
  getUserById,
  loginUser,
  registerAccount,
  reSendOTPService,
  revokeRefreshToken,
  rotateRefreshToken,
  verifyEmailOTP,
} from "./auth.services";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../config/cookies";
import { AppError } from "../../utils/AppError";

export const registerController: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  await registerAccount(req.body);
  return res.status(200).json({
    success: true,
    message:
      "Registration successful. Please verify the OTP sent to your email.",
  });
};

export const resendOTPController: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { email } = req.body;
  console.log(email);

  if (!validateEmail(email)) {
    throw new AppError(
      " Invalid email. Please use an email address with the 'oic.edu.np' domain.",
      400,
    );
  }

  await reSendOTPService(email);
  return res.status(200).json({
    success: true,
    message: "OTP resent. Please verify the OTP sent to your email.",
  });
};

// controller that verifies otp
export const verifyEmailController: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { email, otp } = req.body;

  if (!validateEmail(email)) {
    throw new AppError(
      " Invalid email. Please use an email address with the 'oic.edu.np' domain.",
      400,
    );
  }

  const result = await verifyEmailOTP(email, otp);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
};

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    res
      .cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions)
      .cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions)
      .status(200)
      .json({ message: "Login successful", user });
  } catch (err) {
    next(err);
  }
}

export async function refreshController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!rawToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const { accessToken, refreshToken, user } =
      await rotateRefreshToken(rawToken);

    res
      .cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions)
      .cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions)
      .status(200)
      .json({ message: "Token refreshed", user });
  } catch (err) {
    next(err);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (rawToken) {
      await revokeRefreshToken(rawToken);
    }

    res
      .clearCookie(ACCESS_TOKEN_COOKIE, accessTokenCookieOptions)
      .clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions)
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getMeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      // Defensive — shouldn't happen since `authenticate` runs first
      throw new AppError("Not authenticated", 401);
    }

    const user = await getUserById(req.user.userId);

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}
