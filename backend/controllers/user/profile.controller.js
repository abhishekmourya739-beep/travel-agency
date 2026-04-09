import userModel from "../../models/user.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";
import { deleteImage } from "../../utils/cloudinary.service";
import bcrypt from "bcrypt";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return apiResponse(res, 200, "Profile fetched successfully", user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, contact } = req.body;

  const existingUser = await userModel.findById(req.user.id);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  if (email && email !== existingUser.email) {
    const emailExists = await userModel.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (emailExists) {
      throw new AppError("Email already in use", 400);
    }
  }

  if (contact && contact !== existingUser.contact) {
    const contactExists = await userModel.findOne({
      contact,
      _id: { $ne: req.user.id },
    });

    if (contactExists) {
      throw new AppError("Contact already in use", 400);
    }
  }

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (contact !== undefined) updateData.contact = contact;

  if (req.file) {
    if (existingUser.image?.public_id) {
      await deleteImage(existingUser.image.public_id);
    }

    updateData.image = {
      public_id: req.file.filename,
      url: req.file.path,
    };
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    )
    .select("-password -refreshToken -otp -otpExpiresAt");

  return apiResponse(res, 200, "Profile updated successfully", updatedUser);
});

export const deactivateProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isActive = false;
  user.refreshToken = null;
  await user.save();

  return apiResponse(res, 200, "Account deactivated successfully");
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await userModel.findById(req.user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSamePassword = bcrypt.compareSync(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return apiResponse(res, 200, "Password changed successfully");
});

export const getLoginSessions = asyncHandler(async (req, res) => {
  const sessions = [
    {
      _id: "current-session",
      device: "Current Device",
      browser: req.headers["user-agent"] || "Unknown Browser",
      location: "Unknown Location",
      ip: req.ip || "IP not available",
      lastActive: "Active now",
    },
  ];

  return apiResponse(res, 200, "Login sessions fetched successfully", sessions);
});

export const getConnectedAccounts = asyncHandler(async (req, res) => {
  return apiResponse(res, 200, "Connected accounts fetched successfully", []);
});
