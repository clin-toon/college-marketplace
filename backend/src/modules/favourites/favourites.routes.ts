// routes/favourite.routes.ts
import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { favouriteParamSchema } from "./favourties.validation";
import {
  addFavouriteHandler,
  removeFavouriteHandler,
  getFavouritesHandler,
} from "./favourite.controllers";

const router = Router();

router.use(authenticate);

router.get("/favourites", getFavouritesHandler);
router.post(
  "/favourites/:listingId",
  validate({ params: favouriteParamSchema }),
  addFavouriteHandler,
);
router.delete(
  "/favourites/:listingId",
  validate({ params: favouriteParamSchema }),
  removeFavouriteHandler,
);

export default router;
