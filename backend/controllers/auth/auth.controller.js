import userModel from "../../models/user.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp, getOtpExpiry } from "../../utils/otp";
import transporter from "../../utils/mail";
import { randomBytes } from "crypto";
import { sendEmail } from "../../utils/sendEmail";
import { welcomeEmailTemplate } from "../../utils/emailTemplates";

export const sendRegisterEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingUser = await userModel.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const otp = generateOtp();
  const hashedOtp = bcrypt.hashSync(String(otp), 10);

  const otpToken = jwt.sign(
    {
      purpose: "register_email_otp",
      email: normalizedEmail,
      otpHash: hashedOtp,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "5m" },
  );

  await transporter.sendMail({
    from: `Travel Agency App <${process.env.MAIL_USER}>`,
    to: normalizedEmail,
    subject: "Verify Your Email",
    text: `Your registration OTP is ${otp}. It will expire in 5 minutes.`,
  });

  return apiResponse(res, 200, "Registration OTP sent successfully", {
    otpToken,
    email: normalizedEmail,
  });
});

export const verifyRegisterEmailOtp = asyncHandler(async (req, res) => {
  const { email, otp, otpToken } = req.body;

  if (!email || !otp || !otpToken) {
    throw new AppError("Email, OTP and otpToken are required", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  let decoded;

  try {
    decoded = jwt.verify(otpToken, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new AppError("OTP session expired. Please request a new OTP.", 400);
  }

  if (
    decoded.purpose !== "register_email_otp" ||
    decoded.email !== normalizedEmail
  ) {
    throw new AppError("Invalid OTP session", 400);
  }

  const isOtpValid = bcrypt.compareSync(String(otp), decoded.otpHash);

  if (!isOtpValid) {
    throw new AppError("Invalid OTP", 400);
  }

  const verifiedEmailToken = jwt.sign(
    {
      purpose: "register_email_verified",
      email: normalizedEmail,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" },
  );

  return apiResponse(res, 200, "Email verified successfully", {
    verifiedEmailToken,
    email: normalizedEmail,
  });
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, contact, verifiedEmailToken } = req.body;

  if (!verifiedEmailToken) {
    throw new AppError("Please verify your email before registration", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  let decodedVerifiedToken;

  try {
    decodedVerifiedToken = jwt.verify(
      verifiedEmailToken,
      process.env.JWT_SECRET_KEY,
    );
  } catch (error) {
    throw new AppError(
      "Email verification expired. Please verify your email again.",
      400,
    );
  }

  if (
    decodedVerifiedToken.purpose !== "register_email_verified" ||
    decodedVerifiedToken.email !== normalizedEmail
  ) {
    throw new AppError("Email is not verified for registration", 400);
  }

  const image = req.file
    ? {
        public_id: req.file.filename,
        url: req.file.path,
      }
    : undefined;

  const existingUser = await userModel.findOne({
    $or: [{ email: normalizedEmail }, { contact }],
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const created = await userModel.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    contact,
    image,
    isVerified: true,
  });

  try {
    await sendEmail({
      to: created.email,
      ...welcomeEmailTemplate({ name: created.name }),
    });
  } catch (error) {
    console.error("Welcome email failed:", error.message);
  }

  return apiResponse(res, 201, "User Created Successfully", created);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await userModel
    .findOne({ email: email })
    .select(" -refreshToken -otp -otpExpiresAt");

  if (!existingUser) {
    throw new AppError("User not found!", 404);
  }
  if (!existingUser.isActive) {
    throw new AppError("Your account has been deactivated", 403);
  }
  const checkPassword = bcrypt.compareSync(password, existingUser.password);
  if (!checkPassword) {
    throw new AppError("Invalid creditentials!", 401);
  }
  console.log(existingUser.toJSON());
  const { password: pass, ...user } = existingUser.toJSON();
  if (checkPassword) {
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    existingUser.refreshToken = refreshToken;
    await existingUser.save();
    return apiResponse(res, 200, "User loggedin Successfully", {
      user,
      accessToken,
      refreshToken,
    });
  }
});

// SEND OTP
export const sendPasswordResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (
    user.otpRequestedAt &&
    Date.now() - new Date(user.otpRequestedAt).getTime() < 30 * 1000
  ) {
    throw new AppError(
      "Please wait 30 seconds before requesting a new OTP",
      400,
    );
  }

  const otp = generateOtp();
  const otpExpiry = getOtpExpiry();
  const hashedOtp = bcrypt.hashSync(otp.toString(), 10);

  user.otp = hashedOtp;
  user.otpExpiresAt = otpExpiry;
  user.otpRequestedAt = new Date();

  user.isResetPasswordOtpVerified = false;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpiresAt = null;

  await user.save();

  await transporter.sendMail({
    from: `Travel Agency App <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  return apiResponse(res, 200, `OTP sent successfully to ${user.email}`);
});

// VERIFY OTP ONLY
export const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new AppError("OTP not requested", 400);
  }

  if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
    throw new AppError("OTP expired", 400);
  }

  const isValidOtp = bcrypt.compareSync(otp.toString(), user.otp);

  if (!isValidOtp) {
    throw new AppError("Invalid OTP", 400);
  }

  const resetToken = randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.isResetPasswordOtpVerified = true;
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpiresAt = resetTokenExpiry;

  user.otp = null;
  user.otpExpiresAt = null;
  user.otpRequestedAt = null;

  await user.save();

  return apiResponse(res, 200, "OTP verified successfully", {
    email: user.email,
    resetToken,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, password, resetToken } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (!user.isResetPasswordOtpVerified) {
    throw new AppError(
      "OTP verification required before resetting password",
      403,
    );
  }

  if (!user.resetPasswordToken || !user.resetPasswordTokenExpiresAt) {
    throw new AppError("Reset session expired. Please verify OTP again.", 403);
  }

  if (user.resetPasswordToken !== resetToken) {
    throw new AppError("Invalid reset token", 403);
  }

  if (Date.now() > new Date(user.resetPasswordTokenExpiresAt).getTime()) {
    throw new AppError("Reset token expired. Please verify OTP again.", 403);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  user.password = hashedPassword;

  user.otp = null;
  user.otpExpiresAt = null;
  user.otpRequestedAt = null;
  user.isResetPasswordOtpVerified = false;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpiresAt = null;

  await user.save();

  return apiResponse(res, 200, "Password updated successfully");
});

export const sendEmailVerificationOtp = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated", 403);
  }

  if (user.isVerified) {
    throw new AppError("Email is already verified", 400);
  }

  const now = Date.now();

  if (user.otpExpiresAt && now < user.otpExpiresAt - 4 * 60 * 1000) {
    throw new AppError("Please wait before requesting a new OTP.", 400);
  }

  const otp = generateOtp();
  const otpExpiry = getOtpExpiry();
  const hashedOtp = bcrypt.hashSync(otp, 10);

  user.emailVerificationOtp = hashedOtp;
  user.emailVerificationOtpExpiresAt = otpExpiry;

  await user.save();

  await transporter.sendMail({
    from: `Travel Agency App <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Verify Your Email",
    text: `Your email verification OTP is ${otp}. It will expire in 5 minutes.`,
  });

  return apiResponse(res, 200, "Email verification OTP sent successfully");
});

export const verifyEmailVerificationOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const user = await userModel.findById(req.user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated", 403);
  }

  if (user.isVerified) {
    throw new AppError("Email is already verified", 400);
  }

  if (!user.emailVerificationOtp || !user.emailVerificationOtpExpiresAt) {
    throw new AppError(
      "No verification OTP found. Please request a new OTP.",
      400,
    );
  }

  if (Date.now() > new Date(user.emailVerificationOtpExpiresAt).getTime()) {
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpiresAt = null;
    await user.save();
    throw new AppError("OTP has expired. Please request a new one.", 400);
  }

  const isOtpValid = bcrypt.compareSync(otp, user.emailVerificationOtp);

  if (!isOtpValid) {
    throw new AppError("Invalid OTP", 400);
  }

  user.isVerified = true;
  user.emailVerificationOtp = null;
  user.emailVerificationOtpExpiresAt = null;

  await user.save();

  return apiResponse(res, 200, "Email verified successfully");
});

//admin login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await userModel.findOne({ email });

  if (!admin) {
    throw new AppError("Admin not found", 404);
  }

  if (admin.role !== "admin") {
    throw new AppError("Unauthorized access", 403);
  }

  const checkPassword = bcrypt.compareSync(password, admin.password);

  if (!checkPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  admin.refreshToken = refreshToken;
  await admin.save();

  const { password: pass, refreshToken: rt, ...adminData } = admin.toJSON();

  return apiResponse(res, 200, "Admin logged in successfully", {
    admin: adminData,
    accessToken,
    refreshToken,
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError("Refresh token required", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated", 403);
  }

  if (user.refreshToken !== token) {
    throw new AppError("Invalid refresh token", 403);
  }

  const newAccessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" },
  );

  return apiResponse(res, 200, "Token refreshed", {
    accessToken: newAccessToken,
  });
});
