import { Router } from "express";
import {
  loginController,
  registerController,
  verifyEmailController,
  refreshController,
  logoutController,
  getMeController,
} from "./auth.controllers";
import { validate } from "../../middlewares/validate.middleware";
import {
  registrationSchema,
  verifyOtpSchema,
  loginSchema,
} from "./auth.validation";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/register",
  validate({ body: registrationSchema }),
  registerController,
);
router.post(
  "/verify-email",
  validate({ body: verifyOtpSchema }),
  verifyEmailController,
);

router.post("/login", validate({ body: loginSchema }), loginController);
router.post("/refresh", authenticate, refreshController);
router.post("/logout", authenticate, logoutController);
router.get("/me", authenticate, getMeController);

export default router;
