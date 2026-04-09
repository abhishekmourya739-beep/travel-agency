import express from "express";
import { auth, isAdmin } from "../../middleware/auth.middleware";
import {
  addHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
} from "../../controllers/admin/hotel.controller";
import {
  addHotelValidation,
  getHotelValidation,
  updateHotelValidation,
} from "../../validation/admin/hotel.validation";
import { handleValidation } from "../../utils/helper";
import { upload } from "../../middleware/upload.middleware";
const router = express.Router();

router.get("/", auth, isAdmin, getHotels);
router.get(
  "/:hotelId",
  auth,
  isAdmin,
  getHotelValidation,
  handleValidation,
  getHotel,
);
router.post(
  "/",
  auth,
  isAdmin,
  upload.array("images", 5),
  addHotelValidation,
  handleValidation,
  addHotel,
);
router.put(
  "/:hotelId",
  auth,
  isAdmin,
  upload.array("images", 5),
  updateHotelValidation,
  handleValidation,
  updateHotel,
);
router.delete("/:hotelId", auth, isAdmin, deleteHotel);
export default router;
