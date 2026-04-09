import "../config/env.js";
import mongoose from "mongoose";
import locationModel from "../models/location.model.js";
import hotelModel from "../models/hotel.model.js";
import packageModel from "../models/package.model.js";

const LOCATION_NAMES = [
  "Bali",
  "Bangkok",
  "Dubai",
  "Goa",
  "Greece",
  "Jaipur",
  "Kashmir",
  "London",
  "Maldives",
  "Manali",
  "New York",
  "Paris",
  "Rome",
  "Shimla",
  "Singapore",
  "Switzerland",
  "Sydney",
  "Tokyo",
  "Turkey",
  "Venice",
];

const PACKAGE_BLUEPRINTS = [
  {
    hotelSuffix: "Comfort Inn",
    tripType: "relaxation",
    duration: 3,
    titlePool: [
      "Budget Escape Package",
      "Smart Saver Retreat",
      "Easy Holiday Package",
      "Weekend Comfort Escape",
      "Affordable Relaxation Deal",
    ],
    priceMultiplier: 2.1,
  },
  {
    hotelSuffix: "Royal Residency",
    tripType: "family",
    duration: 4,
    titlePool: [
      "Family Delight Package",
      "Family Fun Retreat",
      "Classic Holiday Escape",
      "Happy Family Getaway",
      "Comfort Family Vacation",
    ],
    priceMultiplier: 2.7,
  },
  {
    hotelSuffix: "Skyline Suites",
    tripType: "adventure",
    duration: 5,
    titlePool: [
      "Adventure Trails Package",
      "Explorer Special Package",
      "Thrill Escape Package",
      "Scenic Adventure Retreat",
      "Outdoor Discovery Package",
    ],
    priceMultiplier: 3.3,
  },
  {
    hotelSuffix: "Heritage Villa",
    tripType: "honeymoon",
    duration: 6,
    titlePool: [
      "Romantic Premium Retreat",
      "Honeymoon Bliss Package",
      "Couple Escape Package",
      "Love and Leisure Retreat",
      "Romantic Sunset Getaway",
    ],
    priceMultiplier: 4.0,
  },
];

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomUniqueImagesFromHotel = (hotelImages, count = 5) => {
  if (!hotelImages || hotelImages.length < count) {
    throw new Error(`Hotel does not have at least ${count} images`);
  }

  return shuffleArray(hotelImages).slice(0, count);
};

const buildPackagePrice = (
  hotelPricePerNight,
  duration,
  multiplier,
  packageIndex,
) => {
  return Math.round(
    hotelPricePerNight * duration * multiplier + packageIndex * 500,
  );
};

const makePackageDescription = (
  locationName,
  hotelName,
  tripType,
  duration,
  title,
) => {
  return `${title} in ${locationName} offers a well-planned ${duration}-day ${tripType} travel experience with a comfortable stay at ${hotelName}, quality accommodation, local sightseeing, relaxation, and memorable moments for travelers seeking a smooth and enjoyable holiday.`;
};

const generateItinerary = (locationName, hotelName, duration, tripType) => {
  const itineraryTemplates = {
    relaxation: [
      {
        title: "Arrival and Leisure Check-in",
        description: `Arrive in ${locationName}, complete your hotel check-in at ${hotelName}, relax, and enjoy a peaceful evening with local surroundings and hotel comfort.`,
      },
      {
        title: "Local Sightseeing and Relaxation",
        description: `Explore popular attractions in ${locationName}, enjoy local experiences, and return to ${hotelName} for a relaxing evening stay.`,
      },
      {
        title: "Free Time and Departure",
        description: `Enjoy breakfast, spend some leisure time exploring nearby places or shopping areas, and complete your departure with beautiful travel memories.`,
      },
      {
        title: "Scenic Exploration and Comfort Stay",
        description: `Visit scenic and popular spots of ${locationName}, enjoy a stress-free day, and unwind at ${hotelName} with premium hospitality.`,
      },
      {
        title: "Recreation and Local Experiences",
        description: `Spend the day enjoying relaxing activities, local food, and nearby attractions before returning to the hotel for overnight comfort.`,
      },
      {
        title: "Final Leisure Morning and Checkout",
        description: `Enjoy your final morning in ${locationName}, have breakfast, and complete checkout from ${hotelName} with a refreshing holiday experience.`,
      },
    ],
    family: [
      {
        title: "Arrival and Family Check-in",
        description: `Arrive in ${locationName}, check in at ${hotelName}, settle in comfortably, and enjoy a relaxed evening suitable for the whole family.`,
      },
      {
        title: "Family Sightseeing Tour",
        description: `Visit major family-friendly attractions in ${locationName}, enjoy quality time together, and return to ${hotelName} for a restful night.`,
      },
      {
        title: "Culture and Local Fun",
        description: `Explore cultural highlights, local shopping, and food experiences while spending memorable time with your family throughout the day.`,
      },
      {
        title: "Leisure and Recreation Day",
        description: `Enjoy a lighter day with hotel relaxation, family-friendly activities, and optional visits to nearby popular attractions in ${locationName}.`,
      },
      {
        title: "Free Time and Exploration",
        description: `Spend quality time as a family exploring local markets, scenic spots, and comfortable spaces before returning to the hotel.`,
      },
      {
        title: "Departure with Family Memories",
        description: `Enjoy breakfast, complete checkout from ${hotelName}, and depart from ${locationName} with wonderful family travel memories.`,
      },
    ],
    adventure: [
      {
        title: "Arrival and Adventure Preparation",
        description: `Arrive in ${locationName}, check in at ${hotelName}, and prepare for an exciting adventure experience with a relaxed evening stay.`,
      },
      {
        title: "Outdoor Exploration Day",
        description: `Enjoy thrilling sightseeing, outdoor activities, and energetic exploration of major attractions and natural highlights in ${locationName}.`,
      },
      {
        title: "Adventure and Scenic Discovery",
        description: `Continue exploring the adventurous side of ${locationName} with scenic experiences, memorable activities, and a comfortable hotel return.`,
      },
      {
        title: "Local Attractions and Activity Time",
        description: `Visit famous places, engage in activity-based experiences, and enjoy the vibrant environment of ${locationName} throughout the day.`,
      },
      {
        title: "Relaxed Exploration and Shopping",
        description: `Spend the day balancing adventure with local shopping, food experiences, and leisure before returning to ${hotelName}.`,
      },
      {
        title: "Checkout and Return Journey",
        description: `Enjoy breakfast, complete checkout from ${hotelName}, and depart from ${locationName} after an adventurous and satisfying holiday.`,
      },
    ],
    honeymoon: [
      {
        title: "Romantic Arrival and Check-in",
        description: `Arrive in ${locationName}, check in at ${hotelName}, and enjoy a peaceful romantic evening in a premium and cozy atmosphere.`,
      },
      {
        title: "Couple Sightseeing Experience",
        description: `Explore beautiful attractions in ${locationName}, enjoy special couple moments, and return to the hotel for a comfortable stay.`,
      },
      {
        title: "Leisure and Romantic Free Time",
        description: `Spend quality time together with relaxing experiences, scenic visits, and a memorable day designed for couples and honeymoon travelers.`,
      },
      {
        title: "Premium Relaxation Day",
        description: `Enjoy the comfort and luxury of ${hotelName}, optional local experiences, and a slow romantic day in ${locationName}.`,
      },
      {
        title: "Scenic Couple Activities",
        description: `Discover charming places, take beautiful photos, enjoy local dining, and create unforgettable memories together during your stay.`,
      },
      {
        title: "Departure with Romantic Memories",
        description: `Have breakfast, complete checkout from ${hotelName}, and depart from ${locationName} with cherished honeymoon memories.`,
      },
    ],
    cultural: [
      {
        title: "Arrival and Cultural Welcome",
        description: `Arrive in ${locationName}, check in at ${hotelName}, and begin your trip with a comfortable evening and local cultural atmosphere.`,
      },
      {
        title: "Heritage and Landmark Visit",
        description: `Explore iconic cultural places, heritage landmarks, and local traditions that make ${locationName} a special destination.`,
      },
      {
        title: "Local Market and Food Experience",
        description: `Enjoy local food, shopping, and authentic cultural interactions while discovering the spirit of ${locationName}.`,
      },
      {
        title: "Historic Exploration Day",
        description: `Visit more historic attractions, monuments, and traditional areas while enjoying a smooth and comfortable travel plan.`,
      },
      {
        title: "Leisure and Cultural Reflection",
        description: `Spend a lighter day revisiting favorite places, shopping for souvenirs, and enjoying the charm of ${locationName}.`,
      },
      {
        title: "Departure and Final Exploration",
        description: `Complete your final sightseeing or shopping, then check out from ${hotelName} and depart with meaningful travel memories.`,
      },
    ],
  };

  const selectedTemplate =
    itineraryTemplates[tripType] || itineraryTemplates.relaxation;

  return Array.from({ length: duration }, (_, index) => ({
    day: index + 1,
    title: selectedTemplate[index].title,
    description: selectedTemplate[index].description,
  }));
};

const buildPackageDocument = ({ location, hotel, blueprint, packageIndex }) => {
  const title = `${location.name} ${getRandomItem(blueprint.titlePool)}`;
  const images = getRandomUniqueImagesFromHotel(hotel.images, 5);
  const thumbnail = images[0];
  const itinerary = generateItinerary(
    location.name,
    hotel.name,
    blueprint.duration,
    blueprint.tripType,
  );
  const price = buildPackagePrice(
    hotel.pricePerNight,
    blueprint.duration,
    blueprint.priceMultiplier,
    packageIndex,
  );

  return {
    title,
    description: makePackageDescription(
      location.name,
      hotel.name,
      blueprint.tripType,
      blueprint.duration,
      title,
    ),
    location: location._id,
    hotel: hotel._id,
    price,
    duration: blueprint.duration,
    tripType: blueprint.tripType,
    thumbnail,
    images,
    itinerary,
    isActive: true,
  };
};

const seedPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected");

    await packageModel.deleteMany({});
    console.log("Old packages deleted");

    const locations = await locationModel.find({
      name: { $in: LOCATION_NAMES },
      isActive: true,
    });

    if (!locations.length) {
      throw new Error("No active locations found. Seed locations first.");
    }

    const sortedLocations = LOCATION_NAMES.map((name) =>
      locations.find((location) => location.name === name),
    ).filter(Boolean);

    const allPackages = [];

    for (const location of sortedLocations) {
      const hotels = await hotelModel.find({
        location: location._id,
        isActive: true,
      });

      if (!hotels.length) {
        console.log(`No hotels found for ${location.name}, skipping`);
        continue;
      }

      for (let i = 0; i < PACKAGE_BLUEPRINTS.length; i++) {
        const blueprint = PACKAGE_BLUEPRINTS[i];

        const matchedHotel = hotels.find((hotel) =>
          hotel.name.endsWith(blueprint.hotelSuffix),
        );

        if (!matchedHotel) {
          console.log(
            `Hotel with suffix "${blueprint.hotelSuffix}" not found in ${location.name}, skipping this package`,
          );
          continue;
        }

        if (!matchedHotel.images || matchedHotel.images.length < 5) {
          console.log(
            `${matchedHotel.name} does not have enough images, skipping this package`,
          );
          continue;
        }

        const packageDoc = buildPackageDocument({
          location,
          hotel: matchedHotel,
          blueprint,
          packageIndex: i + 1,
        });

        allPackages.push(packageDoc);
      }
    }

    if (!allPackages.length) {
      throw new Error("No packages prepared for insertion");
    }

    await packageModel.insertMany(allPackages);

    console.log(
      `Packages seeded successfully: ${allPackages.length} packages inserted`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Package seeder failed:", error.message);
    process.exit(1);
  }
};

seedPackages();
