import express from "express";
import {
  getLocation,
  getLocations,
} from "../../controllers/user/location.controller";
import { auth } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", getLocations);
router.get("/:locationId", getLocation);

export default router;
