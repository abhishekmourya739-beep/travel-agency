import express from "express";
import {
  getFeaturedPackages,
  getPackage,
  getPackages,
  getPackageSearchData,
} from "../../controllers/user/package.controller";

const router = express.Router();
router.get("/", getPackages);
router.get("/featured", getFeaturedPackages);
router.get("/search_data", getPackageSearchData);

router.get("/:packageId", getPackage);

export default router;
