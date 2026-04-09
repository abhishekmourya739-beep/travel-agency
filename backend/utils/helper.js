import { validationResult } from "express-validator";
import { cleanupUploadedFiles } from "../validation/admin/cleanupUploadedfiles";

export const handleValidation = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());

  let errorsArray = errors.array();

  let errorMsg = errorsArray.map((e) => {
    return { message: e.msg, field: e.path };
  });

  if (!errors.isEmpty()) {
    await cleanupUploadedFiles(req);
    return res.status(400).json({
      errors: errorMsg,
    });
  }
  next();
};
