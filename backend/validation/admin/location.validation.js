import { body, param } from "express-validator";

export const addLocationValidation = [
  body("name").notEmpty().withMessage("Location name is required").trim(),

  body("country").notEmpty().withMessage("Country is required").trim(),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters long")
    .trim(),
  ,
];

export const updateLocationValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location name cannot be empty"),

  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("description cannot be empty")
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters long"),

  param("locationId")
    .notEmpty()
    .withMessage("LocationId is required")
    .isMongoId()
    .withMessage("Invalid LocationId"),
];
