import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { categoryHandler } from "./categories.controller";
const router = Router();

router.use(authenticate);

router.get("/", categoryHandler);

export default router;
