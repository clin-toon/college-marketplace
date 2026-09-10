import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import * as adminService from "./admin.services";
import {
  AdminListUsersQuery,
  AdminListListingsQuery,
  UpdateUserRoleInput,
  UpdatePostingPermissionInput,
  UpdateListingStatusInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./admin.validation";

function requireAdmin(req: Request) {
  if (!req.user) throw new AppError("Not authenticated", 401);
  return req.user;
}

// ---------- Dashboard ----------
export async function getStatsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// ---------- Users ----------
export async function getUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const filters = req.query as unknown as AdminListUsersQuery;
    const { users, pagination } = await adminService.getAllUsers(filters);
    res.status(200).json({ success: true, data: users, pagination });
  } catch (err) {
    next(err);
  }
}

export async function getUserDetailHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const { id } = req.params;
    const user = await adminService.getUserDetail(id as string);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRoleHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const admin = requireAdmin(req);
    const { id } = req.params;
    const { role } = req.body as UpdateUserRoleInput;

    const user = await adminService.updateUserRole(
      id as string,
      admin.userId,
      role,
    );
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updatePostingPermissionHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const { id } = req.params;
    const { isAllowedToPost } = req.body as UpdatePostingPermissionInput;

    const result = await adminService.updatePostingPermission(
      id as string,
      isAllowedToPost,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const admin = requireAdmin(req);
    const { id } = req.params;

    await adminService.deleteUser(id as string, admin.userId);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
}

// ---------- Listings ----------
export async function getListingsAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const filters = req.query as unknown as AdminListListingsQuery;
    const { listings, pagination } =
      await adminService.getAllListingsAdmin(filters);
    res.status(200).json({ success: true, data: listings, pagination });
  } catch (err) {
    next(err);
  }
}

export async function updateListingStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const { id } = req.params;
    const { status } = req.body as UpdateListingStatusInput;

    const listing = await adminService.updateListingStatusAdmin(
      id as string,
      status,
    );
    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
}

export async function deleteListingAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const { id } = req.params;

    await adminService.deleteListingAdmin(id as string);
    res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
}

// ---------- Categories ----------
export async function getCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const categories = await adminService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function createCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const category = await adminService.createCategory(
      req.body as CreateCategoryInput,
    );
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const { id } = req.params;
    const category = await adminService.updateCategory(
      id as string,
      req.body as UpdateCategoryInput,
    );
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    requireAdmin(req);
    const { id } = req.params;
    await adminService.deleteCategory(id as string);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
}
