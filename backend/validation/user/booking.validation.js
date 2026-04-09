import { body, param } from "express-validator";

export const createBookingValidation = [
  body("travelPackage")
    .notEmpty()
    .withMessage("Package is required")
    .isMongoId()
    .withMessage("Invalid package id"),

  body("travelDate")
    .notEmpty()
    .withMessage("Travel date is required")
    .isISO8601()
    .withMessage("Travel date must be a valid date")
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error("Travel date cannot be in the past");
      }

      return true;
    }),

  body("numberOfPeople")
    .notEmpty()
    .withMessage("Number of people is required")
    .isInt({ min: 1 })
    .withMessage("Number of people must be at least 1"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["card", "upi", "netbanking", "wallet", "cash"])
    .withMessage("Invalid payment method"),
];

export const getBookingValidation = [
  param("bookingId")
    .notEmpty()
    .withMessage("BookingId is required")
    .matches(/^BOOK-\d+-\d+$/)
    .withMessage("Invalid booking id format"),
];

export const cancelBookingValidation = [
  param("bookingId")
    .notEmpty()
    .withMessage("BookingId is required")
    .matches(/^BOOK-\d+-\d+$/)
    .withMessage("Invalid booking id format"),
];
