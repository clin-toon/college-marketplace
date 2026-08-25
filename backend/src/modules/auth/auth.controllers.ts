import { Request, RequestHandler, Response } from "express";
import { registerAccount, verifyEmailOTP } from "./auth.services";
import { validateEmail } from "./auth.helpers";
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

export const loginController = (req: Request, res: Response) => {};
