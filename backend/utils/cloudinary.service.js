import cloudinary from "../config/cloudinary.js";

/**
 * Delete image from Cloudinary using public_id
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
};
