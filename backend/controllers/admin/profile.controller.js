import bcrypt from "bcrypt";
import userModel from "../../models/user.model";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/appError";
import apiResponse from "../../utils/apiResponse";
import { deleteImage } from "../../utils/cloudinary.service";

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return apiResponse(res, 200, "Profile fetched successfully", user);
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, email, contact } = req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (email || contact) {
    const existingUser = await userModel.findOne({
      _id: { $ne: userId },
      $or: [...(email ? [{ email }] : []), ...(contact ? [{ contact }] : [])],
    });

    if (existingUser) {
      throw new AppError("Email or contact already in use", 409);
    }
  }

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (contact !== undefined) updateData.contact = contact;

  if (req.file) {
    if (user.image?.public_id) {
      await deleteImage(user.image.public_id);
    }

    updateData.image = {
      public_id: req.file.filename,
      url: req.file.path,
    };
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    )
    .select("-password");

  return apiResponse(res, 200, "Profile updated successfully", updatedUser);
});

export const changeMyPassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError("Current password is incorrect", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("New password and confirm password do not match", 400);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return apiResponse(res, 200, "Password changed successfully");
});
