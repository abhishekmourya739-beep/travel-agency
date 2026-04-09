import "../config/env.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { deleteImage } from "../utils/cloudinary.service.js";
import locationModel from "../models/location.model.js";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locations = [
  {
    name: "Bali",
    country: "Indonesia",
    description:
      "Bali is a tropical paradise known for beaches, temples, lush rice terraces, and relaxing island experiences.",
    fileName: "bali",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    description:
      "Bangkok is a lively city famous for street food, nightlife, temples, shopping, and vibrant urban energy.",
    fileName: "bangkok",
  },
  {
    name: "Dubai",
    country: "UAE",
    description:
      "Dubai is a luxury destination known for modern skylines, desert safaris, shopping malls, and premium experiences.",
    fileName: "dubai",
  },
  {
    name: "Goa",
    country: "India",
    description:
      "Goa is a famous coastal destination known for beaches, nightlife, seafood, water sports, and Portuguese charm.",
    fileName: "goa",
  },
  {
    name: "Greece",
    country: "Greece",
    description:
      "Greece is known for stunning islands, whitewashed buildings, ancient history, blue seas, and beautiful sunsets.",
    fileName: "greece",
  },
  {
    name: "Jaipur",
    country: "India",
    description:
      "Jaipur, the Pink City, is known for grand forts, royal palaces, colorful markets, and rich cultural heritage.",
    fileName: "jaipur",
  },
  {
    name: "Kashmir",
    country: "India",
    description:
      "Kashmir is a breathtaking destination known for valleys, lakes, mountains, gardens, and peaceful natural beauty.",
    fileName: "kashmir",
  },
  {
    name: "London",
    country: "United Kingdom",
    description:
      "London is a vibrant global city known for iconic landmarks, museums, theatre, shopping, and historic architecture.",
    fileName: "london",
  },
  {
    name: "Maldives",
    country: "Maldives",
    description:
      "The Maldives is a luxury island destination famous for crystal-clear waters, water villas, diving, and romantic stays.",
    fileName: "maldives",
  },
  {
    name: "Manali",
    country: "India",
    description:
      "Manali is a scenic hill station known for snowy mountains, adventure sports, riverside views, and cool weather.",
    fileName: "manali",
  },
  {
    name: "New York",
    country: "United States",
    description:
      "New York is a world-famous city known for skyscrapers, Times Square, culture, shopping, and iconic city life.",
    fileName: "newyork",
  },
  {
    name: "Paris",
    country: "France",
    description:
      "Paris is the city of love, known for the Eiffel Tower, charming cafés, art museums, and romantic streets.",
    fileName: "paris",
  },
  {
    name: "Rome",
    country: "Italy",
    description:
      "Rome is a historic city known for ancient ruins, the Colosseum, beautiful piazzas, and timeless architecture.",
    fileName: "rome",
  },
  {
    name: "Shimla",
    country: "India",
    description:
      "Shimla is a beautiful hill destination known for colonial charm, mountain views, cool weather, and family holidays.",
    fileName: "shimla",
  },
  {
    name: "Singapore",
    country: "Singapore",
    description:
      "Singapore is a modern city-state known for skyline views, clean streets, gardens, family attractions, and shopping.",
    fileName: "singapore",
  },
  {
    name: "Switzerland",
    country: "Switzerland",
    description:
      "Switzerland is famous for alpine beauty, snow-covered peaks, lakes, scenic train rides, and premium travel experiences.",
    fileName: "switzerland",
  },
  {
    name: "Sydney",
    country: "Australia",
    description:
      "Sydney is a stunning waterfront city known for the Opera House, beaches, harbour views, and vibrant city life.",
    fileName: "sydney",
  },
  {
    name: "Tokyo",
    country: "Japan",
    description:
      "Tokyo is a dynamic city known for neon lights, technology, food culture, temples, and futuristic urban experiences.",
    fileName: "tokyo",
  },
  {
    name: "Turkey",
    country: "Turkey",
    description:
      "Turkey is known for cultural richness, historic architecture, scenic landscapes, hot air balloons, and unique heritage.",
    fileName: "turkey",
  },
  {
    name: "Venice",
    country: "Italy",
    description:
      "Venice is a romantic canal city known for gondolas, bridges, historic buildings, and unforgettable views.",
    fileName: "venice",
  },
];

const uploadImageToCloudinary = async (filePath, locationName) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "travel_app/locations",
    public_id: `${locationName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

const removeOldLocationsAndImages = async () => {
  const oldLocations = await locationModel.find({});

  for (const location of oldLocations) {
    if (location?.image?.public_id) {
      await deleteImage(location.image.public_id);
      console.log(`Deleted old Cloudinary image: ${location.image.public_id}`);
    }
  }

  await locationModel.deleteMany({});
  console.log("Deleted old locations from database");
};

const seedLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected");

    await removeOldLocationsAndImages();

    const preparedLocations = [];

    for (const item of locations) {
      try {
        const getImagePath = (baseName) => {
          const jpgPath = path.join(
            __dirname,
            "../seed-images/locations",
            `${baseName}.jpg`,
          );

          const jpegPath = path.join(
            __dirname,
            "../seed-images/locations",
            `${baseName}.jpeg`,
          );

          const pngPath = path.join(
            __dirname,
            "../seed-images/locations",
            `${baseName}.png`,
          );

          if (fs.existsSync(jpgPath)) return jpgPath;
          if (fs.existsSync(jpegPath)) return jpegPath;
          if (fs.existsSync(pngPath)) return pngPath;

          throw new Error(`Image not found for ${baseName}`);
        };

        const imagePath = getImagePath(item.fileName);

        const uploadedImage = await uploadImageToCloudinary(
          imagePath,
          item.name,
        );

        preparedLocations.push({
          name: item.name,
          country: item.country,
          description: item.description,
          image: uploadedImage,
          isActive: true,
        });

        console.log(`Uploaded and prepared: ${item.name}`);
      } catch (error) {
        console.error(`Failed for ${item.name}:`, error.message);
      }
    }
    if (!preparedLocations.length) {
      throw new Error("No locations were prepared for insertion");
    }

    await locationModel.insertMany(preparedLocations);
    console.log("Locations seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeder failed:", error.message);
    process.exit(1);
  }
};

seedLocations();
