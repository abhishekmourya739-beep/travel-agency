import { body, param } from "express-validator";

export const addUserValidation = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should contain @ and .")
    .trim(),
  body("password")
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

  body("contact")
    .notEmpty()
    .withMessage("Contact is Required")
    .isNumeric()
    .withMessage("Contact should contain only Numbers")
    .matches(/^\d{10}$/)
    .withMessage("Contact number must be exactly 10 digits")
    .trim(),
];

export const updateUserValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("email").optional().trim().isEmail().withMessage("Invalid email format"),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),

  body("contact")
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Contact number must be exactly 10 digits"),

  param("userId")
    .notEmpty()
    .withMessage("UserId is required")
    .isMongoId()
    .withMessage("Invalid UserId format"),
];
