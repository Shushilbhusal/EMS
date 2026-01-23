import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ---------------- Validate Environment ----------------
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(" Missing Cloudinary environment variables");
}

// ---------------- Config Setup ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- Upload Media ----------------
export const uploadMedia = async (filePath: string): Promise<UploadApiResponse | null> => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // handles image/video/pdf automatically
      folder: "user_profiles", // optional: keeps uploads organized
      eager: [
        { quality: "auto:best", fetch_format: "auto" }
      ],
      eager_async: true,
    });
    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};


// ---------------- Delete Video ----------------
export const deleteMediaFromCloudinary = async (publicId: string) => {
  try {
    // delete as image
    let res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (res.result === "ok" || res.result === "not found") return true;



    if (res.result === "ok" || res.result === "not found") return true;

    // delete as raw
    res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    if (res.result === "ok" || res.result === "not found") return true;

    console.error("Delete failed for all resource types");
    return false;
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
};