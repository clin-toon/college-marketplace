import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new AppError("Please log in to continue", 401));
  }
  if (req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Please log in to continue", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }
    next();
  };
}
