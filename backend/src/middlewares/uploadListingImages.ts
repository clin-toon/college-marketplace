import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

const storage = multer.memoryStorage(); // keep files in memory; we stream straight to Cloudinary, never touch disk

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
}).array("images", 6); // frontend field name must be "images"

export function uploadListingImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("Each image must be under 5MB", 400));
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return next(
          new AppError("You can upload up to 6 images per listing", 400),
        );
      }
      return next(new AppError(err.message, 400));
    }

    next(new AppError(err.message || "Image upload failed", 400));
  });
}
