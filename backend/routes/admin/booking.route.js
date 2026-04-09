import express from "express";
import { auth, isAdmin } from "../../middleware/auth.middleware";
import {
  getBookingValidation,
  updateBookingValidation,
} from "../../validation/admin/booking.validation";
import { handleValidation } from "../../utils/helper";
import {
  getBooking,
  getBookings,
  updateBooking,
} from "../../controllers/admin/booking.controller";
import { getDashboardStats } from "../../controllers/admin/stats.controller";
const router = express.Router();
router.get(
  "/",
  auth,
  isAdmin,

  getBookings,
);

router.get(
  "/:bookingId",
  auth,
  isAdmin,
  getBookingValidation,
  handleValidation,
  getBooking,
);
router.patch(
  "/:bookingId",
  auth,
  isAdmin,
  updateBookingValidation,
  handleValidation,
  updateBooking,
);

router.get("/dashboard/stats", auth, isAdmin, getDashboardStats);

export default router;
