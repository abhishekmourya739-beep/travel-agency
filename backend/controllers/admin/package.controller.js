import hotelModel from "../../models/hotel.model";
import locationModel from "../../models/location.model";
import packageModel from "../../models/package.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";
import { deleteImage } from "../../utils/cloudinary.service";

export const addPackage = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    hotel,
    price,
    duration,
    tripType,
    itinerary,
  } = req.body;
  const parsedItinerary =
    typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;

  const existingLocation = await locationModel.findById(location);
  if (!existingLocation) {
    throw new AppError("Location not found!", 404);
  }
  const existingHotel = await hotelModel.findById(hotel);
  if (!existingHotel) {
    throw new AppError("Hotel not found!", 404);
  }

  if (existingHotel.location.toString() !== location) {
    throw new AppError("Selected hotel not found in this location", 400);
  }

  const existingPackage = await packageModel.findOne({
    title,
    location,
    hotel,
  });
  if (existingPackage) {
    throw new AppError("Package already exists", 409);
  }
  const images =
    req.files?.map((file) => ({
      public_id: file.filename,
      url: file.path,
    })) || [];

  const thumbnail = images.length > 0 ? images[0] : undefined;

  const created = await packageModel.create({
    title,
    description,
    location,
    hotel,
    price,
    duration,
    tripType,
    itinerary: parsedItinerary,
    images,
    thumbnail,
  });

  return apiResponse(res, 201, "Package created Successfully", created);
});

export const getPackages = asyncHandler(async (req, res) => {
  const packages = await packageModel
    .find()
    .populate("location", "name country")
    .populate("hotel", "name hotelType rating thumbnail");

  return apiResponse(res, 200, "Packages fetched Successfully", packages);
});

export const getPackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const singlePackage = await packageModel
    .findOne({ _id: packageId })
    .populate("location", "name country description image")
    .populate(
      "hotel",
      "name description rating pricePerNight roomsAvailable amenities hotelType thumbnail images",
    );
  if (!singlePackage) {
    throw new AppError("Package not found", 404);
  }
  return apiResponse(res, 200, "Package Fetched Successfully", singlePackage);
});

export const updatePackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  const singlePackage = await packageModel.findById(packageId);
  if (!singlePackage) {
    throw new AppError("Package not found!", 404);
  }

  const {
    title,
    description,
    location,
    hotel,
    price,
    duration,
    tripType,
    itinerary,
  } = req.body;

  const parsedItinerary =
    typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;

  // final values after update
  const finalTitle = title !== undefined ? title : singlePackage.title;
  const finalLocation =
    location !== undefined ? location : singlePackage.location.toString();
  const finalHotelId =
    hotel !== undefined ? hotel : singlePackage.hotel.toString();

  // check location only if new location is sent
  if (location) {
    const existingLocation = await locationModel.findById(location);
    if (!existingLocation) {
      throw new AppError("Location not found!", 404);
    }
  }

  // get final hotel and check it exists
  const finalHotel = await hotelModel.findById(finalHotelId);
  if (!finalHotel) {
    throw new AppError("Hotel not found!", 404);
  }

  // check hotel belongs to final location
  if (finalHotel.location.toString() !== finalLocation) {
    throw new AppError("Selected hotel does not belong to this location", 400);
  }

  // check duplicate package
  const existingPackage = await packageModel.findOne({
    title: finalTitle,
    location: finalLocation,
    hotel: finalHotelId,
    _id: { $ne: packageId },
  });

  if (existingPackage) {
    throw new AppError(
      "Package already exists in this location and hotel",
      409,
    );
  }

  const updatedData = {};

  if (title !== undefined) updatedData.title = title;
  if (description !== undefined) updatedData.description = description;
  if (location !== undefined) updatedData.location = location;
  if (hotel !== undefined) updatedData.hotel = hotel;
  if (price !== undefined) updatedData.price = price;
  if (duration !== undefined) updatedData.duration = duration;
  if (tripType !== undefined) updatedData.tripType = tripType;
  if (itinerary !== undefined) updatedData.itinerary = parsedItinerary;

  if (req.files?.length) {
    if (singlePackage.images?.length) {
      await Promise.all(
        singlePackage.images.map(async (file) => {
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

  const updated = await packageModel
    .findByIdAndUpdate(
      packageId,
      { $set: updatedData },
      { returnDocument: "after", runValidators: true },
    )
    .populate("location", "name country description image")
    .populate(
      "hotel",
      "name description rating pricePerNight roomsAvailable amenities hotelType thumbnail images",
    );

  return apiResponse(res, 200, "Package Updated Successfully", updated);
});

export const deletePackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const deleted = await packageModel.findByIdAndUpdate(
    packageId,
    { isActive: false },
    { returnDocument: "after", runValidators: true },
  );
  if (!deleted) {
    throw new AppError("Package not found!", 404);
  }
  return apiResponse(res, 200, "Package deactivated Successfully", deleted);
});
