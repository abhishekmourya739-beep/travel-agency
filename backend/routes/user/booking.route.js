import express from "express";
import {
  cancelBooking,
  createBooking,
  getBooking,
  getMyBookings,
} from "../../controllers/user/booking.controller";
import {
  cancelBookingValidation,
  createBookingValidation,
  getBookingValidation,
} from "../../validation/user/booking.validation";
import { handleValidation } from "../../utils/helper";
import { auth } from "../../middleware/auth.middleware";
const router = express.Router();

router.get("/", auth, getMyBookings);
router.get(
  "/:bookingId",
  auth,
  getBookingValidation,
  handleValidation,
  getBooking,
);
router.post(
  "/",
  auth,
  createBookingValidation,
  handleValidation,
  createBooking,
);
router.patch(
  "/:bookingId/cancel",
  auth,
  cancelBookingValidation,
  handleValidation,
  cancelBooking,
);

export default router;
