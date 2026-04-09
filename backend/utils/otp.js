import crypto from "crypto";

export const generateOtp = (length = 6) => {
  return crypto
    .randomInt(0, 10 ** length)
    .toString()
    .padStart(length, "0");
};

// here this logig expirestheotp in 5 minutes from the time of generation 5 is minutes 60 is seconds in minutes and 1000 is milliseconds in second this give exactly 5 minutes in milliseconds
export const getOtpExpiry = () => {
  return Date.now() + 5 * 60 * 1000;
};
