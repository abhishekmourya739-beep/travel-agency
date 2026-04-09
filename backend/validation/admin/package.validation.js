import { body, param } from "express-validator";

export const addPackageValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Package title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Package title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 30, max: 2000 })
    .withMessage("Description must be between 30 and 2000 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isMongoId()
    .withMessage("Invalid location id"),

  body("hotel")
    .trim()
    .notEmpty()
    .withMessage("Hotel is required")
    .isMongoId()
    .withMessage("Invalid hotel id"),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Package price is required")
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Package price must be greater than 0"),

  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Duration is required")
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 day"),

  body("tripType")
    .trim()
    .notEmpty()
    .withMessage("Trip type is required")
    .isIn(["adventure", "cultural", "relaxation", "family", "honeymoon"])
    .withMessage("Invalid trip type"),

  body("itinerary")
    .notEmpty()
    .withMessage("Itinerary is required")
    .custom((value) => {
      let parsedValue = value;

      // convert string → JSON
      if (typeof value === "string") {
        try {
          parsedValue = JSON.parse(value);
        } catch {
          throw new Error("Itinerary must be a valid JSON array");
        }
      }

      if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
        throw new Error("Itinerary must be a non-empty array");
      }

      parsedValue.forEach((item, index) => {
        const day = Number(item.day); // 🔥 FIX HERE

        if (isNaN(day) || day < 1) {
          throw new Error(
            `Itinerary day at index ${index} must be a number greater than 0`,
          );
        }

        if (
          !item.title ||
          typeof item.title !== "string" ||
          item.title.trim().length < 3
        ) {
          throw new Error(
            `Itinerary title at index ${index} must be at least 3 characters long`,
          );
        }

        if (
          !item.description ||
          typeof item.description !== "string" ||
          item.description.trim().length < 10
        ) {
          throw new Error(
            `Itinerary description at index ${index} must be at least 10 characters long`,
          );
        }
      });

      return true;
    }),
];

export const updatePackageValidation = [
  param("packageId")
    .notEmpty()
    .withMessage("PackageId is required")
    .isMongoId()
    .withMessage("Invalid package id"),

  body("title")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Package title must be between 3 and 100 characters"),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage("Description must be between 30 and 2000 characters"),

  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isMongoId()
    .withMessage("Invalid location id"),

  body("hotel")
    .optional({ checkFalsy: true })
    .trim()
    .isMongoId()
    .withMessage("Invalid hotel id"),

  body("price")
    .optional({ checkFalsy: true })
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Package price must be greater than 0"),

  body("duration")
    .optional({ checkFalsy: true })
    .trim()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 day"),

  body("tripType")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["adventure", "cultural", "relaxation", "family", "honeymoon"])
    .withMessage("Invalid trip type"),

  body("itinerary")
    .optional({ checkFalsy: true })
    .custom((value) => {
      let parsedValue = value;

      if (typeof value === "string") {
        try {
          parsedValue = JSON.parse(value);
        } catch {
          throw new Error("Itinerary must be a valid JSON array");
        }
      }

      if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
        throw new Error("Itinerary must be a non-empty array");
      }

      parsedValue.forEach((item, index) => {
        const day = Number(item.day); // 🔥 FIX

        if (isNaN(day) || day < 1) {
          throw new Error(
            `Itinerary day at index ${index} must be a number greater than 0`,
          );
        }

        if (!item.title || item.title.trim().length < 3) {
          throw new Error(`Invalid title at index ${index}`);
        }

        if (!item.description || item.description.trim().length < 10) {
          throw new Error(`Invalid description at index ${index}`);
        }
      });

      return true;
    }),
];

export const getPackageValidation = [
  param("packageId")
    .notEmpty()
    .withMessage("PackageId is required")
    .isMongoId()
    .withMessage("Invalid package id"),
];

export const deletePackageValidation = [
  param("packageId")
    .notEmpty()
    .withMessage("PackageId is required")
    .isMongoId()
    .withMessage("Invalid package id"),
];
