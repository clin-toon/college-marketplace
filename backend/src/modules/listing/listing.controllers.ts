import { Request, Response, NextFunction } from "express";
import { getAllListings, getListingById } from "./listing.services";
import { ListingQuery } from "./listing.schema";

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
