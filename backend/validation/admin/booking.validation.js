import { body, param } from "express-validator";

export const getBookingValidation = [
  param("bookingId")
    .notEmpty()
    .withMessage("BookingId is required")
    .matches(/^BOOK-\d+-\d+$/)
    .withMessage("Invalid booking id format"),
];

export const updateBookingValidation = [
  param("bookingId")
    .notEmpty()
    .withMessage("BookingId is required")
    .matches(/^BOOK-\d+-\d+$/)
    .withMessage("Invalid booking id format"),

  body("bookingStatus")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage("Invalid booking status"),

  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Invalid payment status"),

  body("paymentMethod")
    .optional()
    .isIn(["card", "upi", "netbanking", "wallet", "cash"])
    .withMessage("Invalid payment method"),
];
