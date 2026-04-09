import express from "express";
import { auth, isAdmin } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import { handleValidation } from "../../utils/helper";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../../controllers/admin/profile.controller";
import {
  updateMyProfileValidation,
  changeMyPasswordValidation,
} from "../../validation/admin/profile.validation";

const router = express.Router();

router.get("/me", auth, isAdmin, getMyProfile);

router.put(
  "/me",
  auth,
  isAdmin,
  upload.single("image"),
  updateMyProfileValidation,
  handleValidation,
  updateMyProfile,
);

router.put(
  "/change-password",
  auth,
  isAdmin,
  changeMyPasswordValidation,
  handleValidation,
  changeMyPassword,
);

export default router;
