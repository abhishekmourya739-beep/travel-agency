import hotelModel from "../../models/hotel.model";
import apiResponse from "../../utils/apiResponse";
import AppError from "../../utils/appError";
import asyncHandler from "../../utils/asyncHandler";

export const getHotels = asyncHandler(async (req, res) => {
  const {
    location,
    search,
    page,
    limit,
    sort,
    hotelType,
    minPrice,
    maxPrice,
    minRating,
  } = req.query;
  // link for pagination
  // {{travel-url}}hotels?page=3&limit=3

  //link for filter by keyword
  // {{travel-url}}hotels?search=ocean

  //link fo filtering high to low
  // {{base-url}}product?sort=htol

  //link fo filtering low to high
  // {{base-url}}product?sort=ltoh

  //link for filtering newly created
  // {{base-url}}product?sort=new
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 24);
  const skipValue = (pageNumber - 1) * limitNumber;

  const filter = { isActive: true };

  if (location) {
    filter.location = location;
  }

  if (hotelType) {
    filter.hotelType = hotelType;
  }

  if (minPrice || maxPrice) {
    filter.pricePerNight = {};

    if (minPrice) {
      filter.pricePerNight.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.pricePerNight.$lte = Number(maxPrice);
    }
  }

  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  if (search?.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { hotelType: { $regex: search.trim(), $options: "i" } },
    ];
  }

  let sortBy = { createdAt: -1 };

  if (sort === "old") {
    sortBy = { createdAt: 1 };
  } else if (sort === "ltoh") {
    sortBy = { pricePerNight: 1 };
  } else if (sort === "htol") {
    sortBy = { pricePerNight: -1 };
  } else if (sort === "ratingHigh") {
    sortBy = { rating: -1 };
  } else if (sort === "ratingLow") {
    sortBy = { rating: 1 };
  }

  const [hotels, total] = await Promise.all([
    hotelModel
      .find(filter)
      .select(
        "name description hotelType rating pricePerNight roomsAvailable amenities images thumbnail location",
      )
      .populate("location", "name country")
      .sort(sortBy)
      .skip(skipValue)
      .limit(limitNumber)
      .lean(),
    hotelModel.countDocuments(filter),
  ]);

  return apiResponse(res, 200, "Hotels fetched successfully", {
    hotels,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
});
// export const getHotels = asyncHandler(async (req, res) => {
//   const { search, location, hotelType, minPrice, maxPrice, sort, page, limit } =
//     req.query;

//   const pageNumber = Number(page) || 1;
//   const limitNumber = Number(limit) || 10;
//   const skipValue = (pageNumber - 1) * limitNumber;

//   let filter = { isActive: true };

//   if (search) {
//     filter.$or = [
//       { name: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } },
//       { hotelType: { $regex: search, $options: "i" } },
//     ];
//   }

//   if (location) {
//     filter.location = location;
//   }

//   if (hotelType) {
//     filter.hotelType = hotelType;
//   }

//   if (minPrice || maxPrice) {
//     filter.pricePerNight = {};

//     if (minPrice) {
//       filter.pricePerNight.$gte = Number(minPrice);
//     }

//     if (maxPrice) {
//       filter.pricePerNight.$lte = Number(maxPrice);
//     }
//   }

//   //filter: sorting
//   //     Sort Value	Meaning	Result
//   // 1	Ascending	Small values first
//   // -1	Descending	Large values first
//   //mongodb default view newy created are always at last
//   let sortBy = { createdAt: -1 };

//   if (sort === "old") {
//     sortBy = { createdAt: 1 };
//   } else if (sort === "ltoh") {
//     sortBy = { pricePerNight: 1 };
//   } else if (sort === "htol") {
//     sortBy = { pricePerNight: -1 };
//   } else if (sort === "toprated") {
//     sortBy = { rating: -1 };
//   }

//   const hotels = await hotelModel
//     .find(filter)
//     .populate("location", "name country")
//     .sort(sortBy)
//     .limit(limitNumber)
//     .skip(skipValue)
//     .sort({ createdAt: -1 });

//   const total = await hotelModel.countDocuments(filter);

//   return apiResponse(res, 200, "Hotels fetched successfully", {
//     count: hotels.length,

//     hotels,
//     pagination: {
//       total,
//       page: pageNumber,
//       limit: limitNumber,
//       totalPages: Math.ceil(total / limitNumber),
//     },
//   });
// });

export const getHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  const hotel = await hotelModel
    .findOne({ _id: hotelId, isActive: true })
    .populate("location", "name country description image")
    .lean();

  if (!hotel) {
    throw new AppError("Hotel not found", 404);
  }

  return apiResponse(res, 200, "Hotel fetched successfully", hotel);
});
