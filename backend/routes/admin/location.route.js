import express from "express";
import { auth, isAdmin } from "../../middleware/auth.middleware";
import {
  addLocation,
  deleteLocation,
  getLocation,
  getLocations,
  updateLocation,
} from "../../controllers/admin/location.controller";
import { upload } from "../../middleware/upload.middleware";
import {
  addLocationValidation,
  updateLocationValidation,
} from "../../validation/admin/location.validation";
import { handleValidation } from "../../utils/helper";
const router = express.Router();

router.get("/", auth, isAdmin, getLocations);
router.get("/:locationId", auth, isAdmin, getLocation);
router.post(
  "/",
  auth,
  isAdmin,
  upload.single("image"),
  addLocationValidation,
  handleValidation,
  addLocation,
);
router.put(
  "/:locationId",
  auth,
  isAdmin,
  upload.single("image"),
  updateLocationValidation,
  handleValidation,
  updateLocation,
);
router.delete("/:locationId", auth, isAdmin, deleteLocation);

export default router;
