import bcrypt from "bcrypt";
import userModel from "../../models/user.model";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/appError";
import apiResponse from "../../utils/apiResponse";
import { deleteImage, uploadImage } from "../../utils/cloudinary.service";

export const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, contact, role, isActive, isVerified } =
    req.body;

  const image = req.file
    ? {
        public_id: req.file.filename,
        url: req.file.path,
      }
    : undefined;

  const existingUser = await userModel.findOne({
    $or: [{ email }, { contact }],
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const created = await userModel.create({
    name,
    email,
    password: hashedPassword,
    contact,
    role: role || "user",
    isActive: isActive === "true" || isActive === true,
    isVerified: isVerified === "true" || isVerified === true,
    image,
  });

  return apiResponse(res, 201, "User Created Successfully", created);
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find().select("-password");
  return apiResponse(res, 200, "Users Fetched Successfully", users);
});

export const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userModel.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return apiResponse(res, 200, "User Fetched Successfully", user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, contact, role, isActive, isVerified } =
    req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (contact !== undefined) updateData.contact = contact;
  if (role !== undefined) updateData.role = role;

  if (isActive !== undefined) {
    updateData.isActive = isActive === "true" || isActive === true;
  }

  if (isVerified !== undefined) {
    updateData.isVerified = isVerified === "true" || isVerified === true;
  }

  if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
  }

  if (req.file) {
    if (user.image?.public_id) {
      await deleteImage(user.image.public_id);
    }

    updateData.image = {
      public_id: req.file.filename,
      url: req.file.path,
    };
  }

  const updated = await userModel
    .findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    )
    .select("-password");

  return apiResponse(res, 200, "User Updated Successfully", updated);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const deleted = await userModel.findByIdAndUpdate(
    userId,
    { isActive: false },
    { returnDocument: "after", runValidators: true },
  );
  if (!deleted) {
    throw new AppError("User not found", 404);
  }

  return apiResponse(res, 200, "User deactivated Successfully");
});
