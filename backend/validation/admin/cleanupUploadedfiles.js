import { deleteImage } from "../../utils/cloudinary.service";

export const cleanupUploadedFiles = async (req) => {
  try {
    if (req.files?.length) {
      await Promise.all(
        req.files.map(async (file) => {
          if (file.filename) {
            await deleteImage(file.filename);
          }
        }),
      );
    }

    if (req.file?.filename) {
      await deleteImage(req.file.filename);
    }
  } catch (error) {
    console.error("File cleanup failed:", error.message);
  }
};
