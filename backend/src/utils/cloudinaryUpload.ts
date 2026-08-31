import streamifier from "streamifier";
import { cloudinary } from "../config/cloudinray";
import { UploadApiResponse } from "cloudinary";

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Failed to delete Cloudinary asset:", publicId, err);
    // best-effort — don't let cleanup failure break the main request
  }
}
