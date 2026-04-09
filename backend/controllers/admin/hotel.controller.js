import hotelModel from "../../models/hotel.model";
import locationModel from "../../models/location.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";
import { deleteImage } from "../../utils/cloudinary.service";

export const addHotel = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    description,
    rating,
    pricePerNight,
    roomsAvailable,
    amenities,
    hotelType,
  } = req.body;

  const existingLocation = await locationModel.findById(location);
  if (!existingLocation) {
    throw new AppError("Location not found!", 404);
  }
  const existingHotel = await hotelModel.findOne({ name, location });
  if (existingHotel) {
    throw new AppError("Hotel already exists on this location", 409);
  }

  const images =
    req.files?.map((file) => ({
      public_id: file.filename,
      url: file.path,
    })) || [];
  const thumbnail = images.length > 0 ? images[0] : undefined;

  const created = await hotelModel.create({
    name,
    location,
    description,
    rating,
    pricePerNight,
    roomsAvailable,
    amenities,
    hotelType,
    images,
    thumbnail,
  });

  return apiResponse(res, 201, "Hotel created successfully", created);
});

export const getHotels = asyncHandler(async (req, res) => {
  const hotels = await hotelModel.find().populate("location", "name country");
  return apiResponse(res, 200, "Hotels fetched Successfully", hotels);
});

export const getHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const hotel = await hotelModel
    .findOne({ _id: hotelId })
    .populate("location", "name country description image");
  if (!hotel) {
    throw new AppError("Hotel not found!", 404);
  }

  return apiResponse(res, 200, "Hotel fetched Succesfully", hotel);
});

export const updateHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  const hotel = await hotelModel.findById(hotelId);
  if (!hotel) {
    throw new AppError("Hotel not found!", 404);
  }

  const {
    name,
    location,
    description,
    rating,
    pricePerNight,
    roomsAvailable,
    amenities,
    hotelType,
  } = req.body;

  if (location) {
    const existingLocation = await locationModel.findById(location);
    if (!existingLocation) {
      throw new AppError("Location not found!", 404);
    }
  }

  if (name || location) {
    const existingHotel = await hotelModel.findOne({
      name: name || hotel.name,
      location: location || hotel.location,
      _id: { $ne: hotelId },
    });

    if (existingHotel) {
      throw new AppError("Hotel already exists in this location", 409);
    }
  }

  const updatedData = {};

  if (name !== undefined) updatedData.name = name;
  if (location !== undefined) updatedData.location = location;
  if (description !== undefined) updatedData.description = description;
  if (rating !== undefined) updatedData.rating = rating;
  if (pricePerNight !== undefined) updatedData.pricePerNight = pricePerNight;
  if (roomsAvailable !== undefined) updatedData.roomsAvailable = roomsAvailable;
  if (amenities !== undefined) updatedData.amenities = amenities;
  if (hotelType !== undefined) updatedData.hotelType = hotelType;

  if (req.files?.length) {
    if (hotel.images?.length) {
      await Promise.all(
        hotel.images.map(async (file) => {
          if (file.public_id) {
            await deleteImage(file.public_id);
          }
        }),
      );
    }

    updatedData.images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    updatedData.thumbnail =
      updatedData.images.length > 0 ? updatedData.images[0] : undefined;
  }

  const updated = await hotelModel
    .findByIdAndUpdate(
      hotelId,
      { $set: updatedData },
      { returnDocument: "after", runValidators: true },
    )
    .populate("location", "name country");

  return apiResponse(res, 200, "Hotel Updated Successfully", updated);
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  const deleted = await hotelModel.findByIdAndUpdate(
    hotelId,
    { isActive: false },
    { returnDocument: "after", runValidators: true },
  );
  if (!deleted) {
    throw new AppError("Hotel not found!", 404);
  }
  return apiResponse(res, 200, "Hotel Deactivated Successfully", deleted);
});
