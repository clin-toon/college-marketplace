import { Router } from "express";
import {
  getListingDetailController,
  getListingsFilterController,
} from "./listing.controllers";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { listingIdParamSchema } from "./listing.schema";
const router = Router();

router.get("/listings", authenticate, getListingsFilterController);
router.get(
  "/listings/:id",
  validate({ params: listingIdParamSchema }),
  getListingDetailController,
);

export default router;
