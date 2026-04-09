import express from "express";
import { auth, isAdmin } from "../../middleware/auth.middleware";
import {
  addPackage,
  deletePackage,
  getPackage,
  getPackages,
  updatePackage,
} from "../../controllers/admin/package.controller";
import {
  addPackageValidation,
  deletePackageValidation,
  getPackageValidation,
  updatePackageValidation,
} from "../../validation/admin/package.validation";
import { handleValidation } from "../../utils/helper";
import { upload } from "../../middleware/upload.middleware";
const router = express.Router();
router.get("/", auth, isAdmin, getPackages);
router.get(
  "/:packageId",
  auth,
  isAdmin,
  getPackageValidation,
  handleValidation,
  getPackage,
);
router.post(
  "/",
  auth,
  isAdmin,
  upload.array("images", 5),
  addPackageValidation,
  handleValidation,
  addPackage,
);
router.put(
  "/:packageId",
  auth,
  isAdmin,
  upload.array("images", 5),
  updatePackageValidation,
  handleValidation,
  updatePackage,
);
router.delete(
  "/:packageId",
  auth,
  isAdmin,
  deletePackageValidation,
  handleValidation,
  deletePackage,
);

export default router;
