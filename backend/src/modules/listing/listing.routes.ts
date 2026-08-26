import { Router } from "express";
import { getListingsFilterController } from "./listing.controllers";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { listingQuerySchema } from "./listing.schema";
const router = Router();

router.get(
  "/listings",
  validate({ body: listingQuerySchema }),
  getListingsFilterController,
);

export default router;
