import { Request, Response, NextFunction } from "express";
import {
  addFavourite,
  removeFavourite,
  getUserFavourites,
} from "./favourite.services";
import { AppError } from "../../utils/AppError";

export async function addFavouriteHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const { listingId } = req.params;
    const favourite = await addFavourite(req.user.userId, listingId);

    res.status(201).json({
      success: true,
      data: favourite,
    });
  } catch (err) {
    next(err);
  }
}

export async function removeFavouriteHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const { listingId } = req.params;
    await removeFavourite(req.user.userId, listingId);

    res.status(200).json({
      success: true,
      message: "Removed from favourites",
    });
  } catch (err) {
    next(err);
  }
}

export async function getFavouritesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const favourites = await getUserFavourites(req.user.userId);

    res.status(200).json({
      success: true,
      data: favourites,
    });
  } catch (err) {
    next(err);
  }
}
