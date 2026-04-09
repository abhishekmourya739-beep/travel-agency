import express from "express";
import {
  register,
  login,
  adminLogin,
  sendPasswordResetOtp,
  refreshToken,
  verifyForgotPasswordOtp,
  resetPassword,
  sendEmailVerificationOtp,
  verifyEmailVerificationOtp,
  sendRegisterEmailOtp,
  verifyRegisterEmailOtp,
} from "../../controllers/auth/auth.controller";
import { handleValidation } from "../../utils/helper";
import {
  loginLimiter,
  otpLimiter,
  otpVerifyLimiter,
} from "../../middleware/rateLimit.middleware";
import { upload } from "../../middleware/upload.middleware";
import {
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyForgotPasswordOtpValidation,
} from "../../validation/auth/auth.validation";
import { auth } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/send-register-email-otp", otpLimiter, sendRegisterEmailOtp);
router.post(
  "/verify-register-email-otp",
  otpVerifyLimiter,
  verifyRegisterEmailOtp,
);

router.post("/register", upload.single("image"), register);
router.post("/login", loginLimiter, login);

router.post(
  "/forgot_password",
  otpLimiter,
  forgotPasswordValidation,
  handleValidation,
  sendPasswordResetOtp,
);

router.post(
  "/verify_forgot_password_otp",
  otpVerifyLimiter,
  verifyForgotPasswordOtpValidation,
  handleValidation,
  verifyForgotPasswordOtp,
);

router.post(
  "/reset_password",
  resetPasswordValidation,
  handleValidation,
  resetPassword,
);

router.post(
  "/send_email_verification_otp",
  auth,
  otpLimiter,
  sendEmailVerificationOtp,
);

router.post(
  "/verify_email_otp",
  auth,
  otpVerifyLimiter,
  verifyEmailVerificationOtp,
);

router.post("/admin/login", loginLimiter, adminLogin);
router.post("/refresh_token", refreshToken);

export default router;
