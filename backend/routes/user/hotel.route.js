import express from "express";
import { auth } from "../../middleware/auth.middleware";
import { getHotel, getHotels } from "../../controllers/user/hotel.controller";
const router = express.Router();
router.get("/", getHotels);
router.get("/:hotelId", getHotel);

export default router;
