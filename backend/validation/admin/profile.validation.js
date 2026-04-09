import { body } from "express-validator";

export const updateMyProfileValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("contact")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Contact cannot be empty")
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact must be between 10 and 15 digits"),
];

export const changeMyPasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
];
