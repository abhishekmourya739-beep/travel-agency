import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

/**
 * Cloudinary storage configuration
 * Images uploaded through multer will be stored directly in Cloudinary
 */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "travel_app", // folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const upload = multer({ storage });
