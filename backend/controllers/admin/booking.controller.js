import bookingModel from "../../models/booking.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";

export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingModel
    .find({ isActive: true })
    .populate("user", "name email contact")
    .populate(
      "travelPackage",
      "title price duration tripType thumbnail location hotel",
    )
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Bookings fetched successfully", bookings);
});

export const getBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await bookingModel
    .findOne({ bookingId: bookingId, isActive: true })
    .populate("user", "name email contact")
    .populate(
      "travelPackage",
      "title description price duration tripType thumbnail location hotel",
    );

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return apiResponse(res, 200, "Booking fetched successfully", booking);
});

export const updateBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { bookingStatus, paymentStatus, paymentMethod } = req.body;

  const booking = await bookingModel
    .findOne({ bookingId, isActive: true })
    .populate("user", "name email contact")
    .populate(
      "travelPackage",
      "title description price duration tripType thumbnail location hotel",
    );
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (bookingStatus !== undefined) {
    booking.bookingStatus = bookingStatus;
  }

  if (paymentStatus !== undefined) {
    booking.paymentStatus = paymentStatus;
  }

  if (paymentMethod !== undefined) {
    booking.paymentMethod = paymentMethod;
  }

  await booking.save();
  return apiResponse(res, 200, "Booking Updated successfully", booking);
});
