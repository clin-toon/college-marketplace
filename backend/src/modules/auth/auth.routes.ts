import { Router } from "express";
import { registerController, verifyEmailController } from "./auth.controllers";
import { validate } from "../../middlewares/validate.middleware";
import { registrationSchema, verifyOtpSchema } from "./auth.validation";

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

export default router;
