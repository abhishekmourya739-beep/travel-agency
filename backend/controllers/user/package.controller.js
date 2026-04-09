import packageModel from "../../models/package.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";

export const getPackages = asyncHandler(async (req, res) => {
  const { search, location, tripType, minPrice, maxPrice, sort, page, limit } =
    req.query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 9, 1), 24);
  const skipValue = (pageNumber - 1) * limitNumber;

  const filter = { isActive: true };

  if (search?.trim()) {
    filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { tripType: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (location) {
    filter.location = location;
  }

  if (tripType) {
    filter.tripType = tripType;
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  const sortMap = {
    old: { createdAt: 1 },
    ltoh: { price: 1 },
    htol: { price: -1 },
    shortDuration: { duration: 1 },
    longDuration: { duration: -1 },
  };

  const sortBy = sortMap[sort] || { createdAt: -1 };

  const [packages, total] = await Promise.all([
    packageModel
      .find(filter)
      .populate("location", "name country")
      .sort(sortBy)
      .skip(skipValue)
      .limit(limitNumber)
      .lean(),
    packageModel.countDocuments(filter),
  ]);

  return apiResponse(res, 200, "Packages fetched successfully", {
    packages,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
});

export const getPackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  const pkg = await packageModel
    .findOne({ _id: packageId, isActive: true })
    .select(
      "title description duration price thumbnail itinerary tripType location hotel",
    )
    .populate("location", "name country description image")
    .populate(
      "hotel",
      "name description hotelType rating pricePerNight roomsAvailable amenities images thumbnail",
    )
    .lean();

  if (!pkg) {
    throw new AppError("Package not found", 404);
  }

  return apiResponse(res, 200, "Package fetched successfully", pkg);
});

export const getPackageSearchData = asyncHandler(async (req, res) => {
  const packages = await packageModel
    .find({ isActive: true })
    .select("title duration location")
    .populate("location", "name country")
    .sort({ createdAt: -1 });

  return apiResponse(
    res,
    200,
    "Package search data fetched successfully",
    packages,
  );
});

export const getFeaturedPackages = asyncHandler(async (req, res) => {
  const packages = await packageModel
    .find({ isActive: true, isFeatured: true })
    .select("title description duration price thumbnail location tripType")
    .populate("location", "name country")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return apiResponse(
    res,
    200,
    "Featured packages fetched successfully",
    packages,
  );
});
