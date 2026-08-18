import { Router } from "express";
import { registerController } from "./auth.controllers";
import { validate } from "../../middlewares/validate.middleware";
import { registrationSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validate({ body: registrationSchema }),
  registerController,
);

export default router;
