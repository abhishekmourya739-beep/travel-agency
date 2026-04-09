import locationModel from "../../models/location.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";
import { deleteImage } from "../../utils/cloudinary.service";

export const addLocation = asyncHandler(async (req, res) => {
  const { name, country, description } = req.body;
  const image = req.file
    ? {
        public_id: req.file.filename,
        url: req.file.path,
      }
    : undefined;

  const existing = await locationModel.findOne({ name });
  if (existing) {
    throw new AppError("Location already exists!", 409);
  }

  const created = await locationModel.create({
    name,
    country,
    description,
    image,
  });
  return apiResponse(res, 201, "Location created Successfully", created);
});

export const getLocations = asyncHandler(async (req, res) => {
  const locations = await locationModel.find();
  return apiResponse(res, 200, "Locations fetched Successfully", locations);
});

export const getLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const location = await locationModel.findOne({ _id: locationId });
  if (!location) {
    throw new AppError("Location not found!", 404);
  }
  return apiResponse(res, 200, "Location fetched Successfully", location);
});

export const updateLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const { name, country, description } = req.body;
  const location = await locationModel.findOne({ _id: locationId });
  if (!location) {
    throw new AppError("Location not found!", 404);
  }
  const updateData = {};
  if (name) updateData.name = name;
  if (country) updateData.country = country;
  if (description) updateData.description = description;
  if (req.file) {
    if (location.image?.public_id) {
      await deleteImage(location.image.public_id);
    }
    updateData.image = {
      public_id: req.file.filename,
      url: req.file.path,
    };
  }
  const updated = await locationModel.findByIdAndUpdate(
    locationId,
    { $set: updateData },
    { returnDocument: "after", runValidators: true },
  );
  return apiResponse(res, 200, "Location Updated Successfully", updated);
});

export const deleteLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;

  const deactivateLocation = await locationModel.findByIdAndUpdate(
    locationId,
    { isActive: false },
    { returnDocument: "after", runValidators: true },
  );
  if (!deactivateLocation) {
    throw new AppError("Location not found!", 404);
  }
  return apiResponse(res, 200, "Location deactivated Successfully");
});
