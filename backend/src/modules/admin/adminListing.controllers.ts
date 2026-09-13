import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import * as adminListingService from "./adminListing.services";
import {
  AdminListingQuery,
  SetStatusInput,
  AnalyticsTimelineQuery,
} from "./adminListing.validation";

function requireAdmin(req: Request) {
  if (!req.user) throw new AppError("Not authenticated", 401);
  return req.user;
}

// ---------- View ----------
export async function getAllListingsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const filters = req.query as unknown as AdminListingQuery;
    const result = await adminListingService.getAllListingsAdmin(filters);
    res
      .status(200)
      .json({
        success: true,
        data: result.listings,
        pagination: result.pagination,
      });
  } catch (err) {
    next(err);
  }
}

export async function getListingDetailHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const listing = await adminListingService.getListingDetailAdmin(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
}

// ---------- Show / Hide ----------
export async function hideListingHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const result = await adminListingService.hideListing(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function showListingHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const result = await adminListingService.showListing(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function setStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const { status } = req.body as SetStatusInput;
    const result = await adminListingService.setListingStatus(
      req.params.id as string,
      status,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// ---------- Analytics ----------
export async function getOverviewStatsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const stats = await adminListingService.getListingOverviewStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getByCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const data = await adminListingService.getListingsByCategory();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getByConditionHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const data = await adminListingService.getListingsByCondition();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTimelineHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const query = req.query as unknown as AnalyticsTimelineQuery;
    const data = await adminListingService.getListingsTimeline(query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getPriceDistributionHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const data = await adminListingService.getPriceDistribution();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTopFavouritedHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const data = await adminListingService.getTopFavouritedListings();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTopSellersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const data = await adminListingService.getTopSellers();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
