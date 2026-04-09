import { body } from "express-validator";

export const updateProfileValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("email").optional().trim().isEmail().withMessage("Invalid email format"),

  body("contact")
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Contact number must be exactly 10 digits"),
];
export const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character")
    .trim(),
];
