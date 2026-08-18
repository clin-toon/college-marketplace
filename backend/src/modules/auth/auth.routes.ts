import { Router } from "express";
import { registerController } from "./auth.controllers";

const router = Router();

router.get("/register", registerController);

export default router;
