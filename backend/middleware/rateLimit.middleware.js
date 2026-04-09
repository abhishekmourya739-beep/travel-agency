import rateLimit from "express-rate-limit";

// limit login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // allow only 5 attempts
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// limit OTP requests
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // only 10 OTP requests
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

// limit OTP verification attempts
export const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many OTP verification attempts. Please try again later.",
  },
});
