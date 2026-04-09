import { body, param } from "express-validator";

export const addHotelValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Hotel name is required")
    .isLength({ min: 3 })
    .withMessage("Hotel name must be at least 3 characters long"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isMongoId()
    .withMessage("Invalid location id"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 30, max: 1000 })
    .withMessage("Description must be between 30 and 1000 characters"),

  body("rating")
    .optional({ checkFalsy: true })
    .trim()
    .toFloat()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("pricePerNight")
    .trim()
    .notEmpty()
    .withMessage("Price per night is required")
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Price per night must be greater than 0"),

  body("roomsAvailable")
    .trim()
    .notEmpty()
    .withMessage("Rooms available is required")
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Rooms available must be 0 or greater"),

  body("hotelType")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["budget", "standard", "luxury", "resort", "villa"])
    .withMessage("Invalid hotel type"),

  body("amenities")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => {
      if (!value) return [];

      if (Array.isArray(value)) return value;

      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [value];
        } catch {
          return value.split(",").map((item) => item.trim());
        }
      }

      return [];
    })
    .isArray()
    .withMessage("Amenities must be an array"),
];

export const updateHotelValidation = [
  body("name")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3 })
    .withMessage("Hotel name must be at least 3 characters long"),

  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isMongoId()
    .withMessage("Invalid location id"),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 30, max: 1000 })
    .withMessage("Description must be between 30 and 1000 characters"),

  body("rating")
    .optional({ checkFalsy: true })
    .trim()
    .toFloat()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("pricePerNight")
    .optional({ checkFalsy: true })
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Price per night must be greater than 0"),

  body("roomsAvailable")
    .optional({ checkFalsy: true })
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Rooms available must be 0 or greater"),

  body("hotelType")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["budget", "standard", "luxury", "resort", "villa"])
    .withMessage("Invalid hotel type"),

  body("amenities")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => {
      if (!value) return [];

      if (Array.isArray(value)) return value;

      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [value];
        } catch {
          return value.split(",").map((item) => item.trim());
        }
      }

      return [];
    })
    .isArray()
    .withMessage("Amenities must be an array"),

  param("hotelId")
    .notEmpty()
    .withMessage("HotelId is required")
    .isMongoId()
    .withMessage("Invalid HotelId"),
];

export const getHotelValidation = [
  param("hotelId")
    .notEmpty()
    .withMessage("HotelId is required")
    .isMongoId()
    .withMessage("Invalid HotelId"),
];
