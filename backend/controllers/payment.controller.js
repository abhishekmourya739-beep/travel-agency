import crypto from "crypto";
import bookingModel from "../models/booking.model.js";
import packageModel from "../models/package.model.js";
import userModel from "../models/user.model.js";
import razorpay from "../utils/razorpay.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { paymentSuccessTemplate } from "../utils/emailTemplates.js";

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  const booking = await bookingModel.findOne({
    bookingId,
    user: userId,
    isActive: true,
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.bookingStatus === "cancelled") {
    throw new AppError(
      "Cannot create payment order for cancelled booking",
      400,
    );
  }

  if (booking.paymentStatus === "paid") {
    throw new AppError("Payment already completed for this booking", 400);
  }

  if (booking.paymentStatus === "refunded") {
    throw new AppError("Cannot create payment order for refunded booking", 400);
  }

  // Reuse same order if still pending
  if (booking.razorpayOrderId && booking.paymentStatus === "pending") {
    return apiResponse(res, 200, "Payment order already exists", {
      key: process.env.RAZORPAY_KEY_ID,
      amount: booking.totalPrice * 100,
      currency: "INR",
      orderId: booking.razorpayOrderId,
      bookingId: booking.bookingId,
    });
  }

  const options = {
    amount: booking.totalPrice * 100,
    currency: "INR",
    receipt: booking.bookingId,
    notes: {
      bookingId: booking.bookingId,
      userId: String(userId),
    },
  };

  const order = await razorpay.orders.create(options);

  booking.razorpayOrderId = order.id;

  if (booking.paymentStatus === "failed") {
    booking.paymentStatus = "pending";
  }

  await booking.save();

  return apiResponse(res, 200, "Payment order created successfully", {
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    orderId: order.id,
    bookingId: booking.bookingId,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;

  const booking = await bookingModel.findOne({
    bookingId,
    user: req.user._id,
    isActive: true,
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new AppError("Invalid payment signature", 400);
  }

  booking.razorpayOrderId = razorpay_order_id;
  booking.razorpayPaymentId = razorpay_payment_id;
  booking.paymentStatus = "paid";
  booking.bookingStatus = "confirmed";

  await booking.save();

  try {
    const [user, packageData] = await Promise.all([
      userModel.findById(booking.user),
      packageModel.findById(booking.travelPackage),
    ]);

    if (user?.email) {
      await sendEmail({
        to: user.email,
        ...paymentSuccessTemplate({
          name: user.name,
          bookingId: booking.bookingId,
          packageTitle: packageData?.title || "Travel Package",
          totalPrice: booking.totalPrice,
        }),
      });
    }
  } catch (error) {
    console.error("Payment success email failed:", error.message);
  }

  return apiResponse(res, 200, "Payment verified successfully", booking);
});

export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expectedSignature) {
    throw new AppError("Invalid webhook signature", 400);
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.captured") {
    const orderId = payload.payment.entity.order_id;
    const paymentId = payload.payment.entity.id;

    const booking = await bookingModel.findOne({ razorpayOrderId: orderId });

    if (booking) {
      const wasAlreadyPaid = booking.paymentStatus === "paid";

      booking.razorpayPaymentId = paymentId;
      booking.paymentStatus = "paid";
      booking.bookingStatus = "confirmed";
      await booking.save();

      if (!wasAlreadyPaid) {
        try {
          const [user, packageData] = await Promise.all([
            userModel.findById(booking.user),
            packageModel.findById(booking.travelPackage),
          ]);

          if (user?.email) {
            await sendEmail({
              to: user.email,
              ...paymentSuccessTemplate({
                name: user.name,
                bookingId: booking.bookingId,
                packageTitle: packageData?.title || "Travel Package",
                totalPrice: booking.totalPrice,
              }),
            });
          }
        } catch (error) {
          console.error("Webhook payment success email failed:", error.message);
        }
      }
    }
  }

  if (event === "payment.failed") {
    const orderId = payload.payment.entity.order_id;

    const booking = await bookingModel.findOne({ razorpayOrderId: orderId });

    if (booking) {
      booking.paymentStatus = "failed";
      await booking.save();
    }
  }

  return res.status(200).json({ success: true });
});
