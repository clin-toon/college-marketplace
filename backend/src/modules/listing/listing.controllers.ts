import { Request, Response, NextFunction } from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
} from "./listing.services";
import { ListingIdParam, ListingQuery } from "./listing.schema";
import { AppError } from "../../utils/AppError";

export async function getListingsFilterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const filters = req.query as unknown as ListingQuery;

    const { listings, pagination } = await getAllListings(filters);

    res.status(200).json({
      success: true,
      data: listings,
      pagination,
    });
  } catch (err) {
    next(err);
  }
}

export async function getListingDetailController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const listing = await getListingById(id);

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (err) {
    next(err);
  }
}

export async function createListingHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const files = (req.files as Express.Multer.File[]) || [];
    const listing = await createListing(req.user.userId, req.body, files);

    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
}

export async function getMyListingsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const listings = await getMyListings(req.user.userId);

    res.status(200).json({ success: true, data: listings });
  } catch (err) {
    next(err);
  }
}

export async function updateListingHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const { id } = req.params as ListingIdParam;
    const files = (req.files as Express.Multer.File[]) || [];
    const listing = await updateListing(id, req.user.userId, req.body, files);

    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
}

export async function deleteListingHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const { id } = req.params as ListingIdParam;
    await deleteListing(id, req.user.userId);

    res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
}
