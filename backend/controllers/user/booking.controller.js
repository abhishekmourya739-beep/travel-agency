import bookingModel from "../../models/booking.model";
import packageModel from "../../models/package.model";
import userModel from "../../models/user.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  bookingConfirmationTemplate,
  bookingCancelledTemplate,
} from "../../utils/emailTemplates.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { travelPackage, travelDate, numberOfPeople, paymentMethod } = req.body;

  const userId = req.user._id;

  const packageData = await packageModel.findOne({
    _id: travelPackage,
    isActive: true,
  });

  if (!packageData) {
    throw new AppError("Package not found", 404);
  }

  const totalPrice = numberOfPeople * packageData.price;
  const bookingId = `BOOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const created = await bookingModel.create({
    user: userId,
    travelPackage,
    travelDate,
    numberOfPeople,
    totalPrice,
    paymentMethod,
    bookingId,
  });

  try {
    const user = await userModel.findById(userId);

    if (user?.email) {
      await sendEmail({
        to: user.email,
        ...bookingConfirmationTemplate({
          name: user.name,
          bookingId: created.bookingId,
          packageTitle: packageData.title,
          travelDate,
          numberOfPeople,
          totalPrice,
        }),
      });
    }
  } catch (error) {
    console.error("Booking confirmation email failed:", error.message);
  }

  return apiResponse(res, 201, "Booking Created Successfully", created);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bookings = await bookingModel
    .find({ user: userId, isActive: true })
    .populate({
      path: "travelPackage",
      select: "title price duration tripType thumbnail location",
      populate: {
        path: "location",
        select: "name country",
      },
    })
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Bookings fetched Successfully", bookings);
});

export const getBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  const booking = await bookingModel
    .findOne({ bookingId, user: userId, isActive: true })
    .populate({
      path: "travelPackage",
      select:
        "title description price duration tripType thumbnail images itinerary location hotel",
      populate: [
        {
          path: "location",
          select: "name country",
        },
        {
          path: "hotel",
          select: "name rating pricePerNight images thumbnail amenities",
        },
      ],
    })
    .populate("user", "name email contact");

  if (!booking) {
    throw new AppError("Booking not found!", 404);
  }

  return apiResponse(res, 200, "Booking fetched Successfully", booking);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  const booking = await bookingModel.findOne({
    bookingId: bookingId,
    user: userId,
    isActive: true,
  });

  if (!booking) {
    throw new AppError("Booking not found!", 404);
  }

  if (booking.bookingStatus === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  booking.bookingStatus = "cancelled";

  if (booking.paymentStatus === "paid") {
    booking.paymentStatus = "refunded";
  }

  await booking.save();

  try {
    const [user, packageData] = await Promise.all([
      userModel.findById(userId),
      packageModel.findById(booking.travelPackage),
    ]);

    if (user?.email) {
      await sendEmail({
        to: user.email,
        ...bookingCancelledTemplate({
          name: user.name,
          bookingId: booking.bookingId,
          packageTitle: packageData?.title || "Travel Package",
          travelDate: booking.travelDate,
          totalPrice: booking.totalPrice,
        }),
      });
    }
  } catch (error) {
    console.error("Booking cancellation email failed:", error.message);
  }

  return apiResponse(res, 200, "Booking cancelled successfully", booking);
});
