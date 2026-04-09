import locationModel from "../../models/location.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";

export const getLocations = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let filter = { isActive: true };
  //search query to filter
  // {{travel-url}}locations?search=india
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  const locations = await locationModel.find(filter).sort({ createdAt: -1 });
  return apiResponse(res, 200, "Locations fetched Successfully", locations);
});

export const getLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const location = await locationModel.findOne({
    _id: locationId,
    isActive: true,
  });
  if (!location) {
    throw new AppError("Location not found!", 404);
  }
  return apiResponse(res, 200, "Location fetched Successfully", location);
});
