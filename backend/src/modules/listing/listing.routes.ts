import { Router } from "express";
import { uploadListingImages } from "../../middlewares/uploadListingImages";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  listingIdParamSchema,
  listingQuerySchema,
  createListingSchema,
  updateListingSchema,
} from "./listing.schema";
import {
  createListingHandler,
  getMyListingsHandler,
  updateListingHandler,
  deleteListingHandler,
  getListingDetailController,
  getListingsFilterController,
} from "./listing.controllers";

import { getListingById } from "./listing.services";
const router = Router();

/**
 * get all the listings
 */
router.get("/", authenticate, getListingsFilterController);
/**
 * Get single list for the user.
 */

router.get(
  "/:id",
  validate({ params: listingIdParamSchema }),
  getListingDetailController,
);

/**
 * seller crud on listings
 */

router.post(
  "/",
  authenticate,
  uploadListingImages,
  validate({ body: createListingSchema }),
  createListingHandler,
);

router.get("/details/mine", authenticate, getMyListingsHandler);

router.put(
  "/:id",
  authenticate,
  uploadListingImages,
  validate({ params: listingIdParamSchema, body: updateListingSchema }),
  updateListingHandler,
);

router.delete(
  "/:id",
  authenticate,
  validate({ params: listingIdParamSchema }),
  deleteListingHandler,
);

export default router;
