import express from "express";
import { auth } from "../../middleware/auth.middleware";
import {
  changePassword,
  deactivateProfile,
  getConnectedAccounts,
  getLoginSessions,
  getProfile,
  updateProfile,
} from "../../controllers/user/profile.controller";
import { upload } from "../../middleware/upload.middleware";
import {
  changePasswordValidation,
  updateProfileValidation,
} from "../../validation/user/user.validation";
import { handleValidation } from "../../utils/helper";

const router = express.Router();
router.get("/", auth, getProfile);
router.put(
  "/",
  auth,
  upload.single("image"),
  updateProfileValidation,
  handleValidation,
  updateProfile,
);
router.put(
  "/change_password",
  auth,
  changePasswordValidation,
  handleValidation,
  changePassword,
);

router.get("/login_sessions", auth, getLoginSessions);

router.get("/connected_accounts", auth, getConnectedAccounts);
router.delete("/", auth, deactivateProfile);
export default router;
