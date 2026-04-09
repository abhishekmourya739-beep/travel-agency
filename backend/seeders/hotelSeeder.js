import "../config/env.js";
import mongoose from "mongoose";
import hotelModel from "../models/hotel.model.js";
import locationModel from "../models/location.model.js";
import cloudinary from "../config/cloudinary.js";
import { deleteImage } from "../utils/cloudinary.service.js";

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

const HOTEL_BLUEPRINTS = [
  {
    suffix: "Grand Palace",
    hotelType: "luxury",
    rating: 4.8,
    pricePerNight: 16500,
    roomsAvailable: 18,
    amenities: [
      "Free WiFi",
      "Swimming Pool",
      "Spa",
      "Breakfast",
      "Room Service",
    ],
  },
  {
    suffix: "Royal Residency",
    hotelType: "standard",
    rating: 4.4,
    pricePerNight: 9800,
    roomsAvailable: 24,
    amenities: [
      "Free WiFi",
      "Breakfast",
      "Parking",
      "Air Conditioning",
      "Laundry",
    ],
  },
  {
    suffix: "Skyline Suites",
    hotelType: "luxury",
    rating: 4.7,
    pricePerNight: 14200,
    roomsAvailable: 16,
    amenities: ["Free WiFi", "Gym", "Restaurant", "City View", "Room Service"],
  },
  {
    suffix: "Nature Resort",
    hotelType: "resort",
    rating: 4.6,
    pricePerNight: 15400,
    roomsAvailable: 15,
    amenities: ["Free WiFi", "Pool", "Spa", "Breakfast", "Airport Shuttle"],
  },
  {
    suffix: "Comfort Inn",
    hotelType: "budget",
    rating: 4.1,
    pricePerNight: 6500,
    roomsAvailable: 30,
    amenities: [
      "Free WiFi",
      "Breakfast",
      "Parking",
      "Air Conditioning",
      "Housekeeping",
    ],
  },
  {
    suffix: "Heritage Villa",
    hotelType: "villa",
    rating: 4.9,
    pricePerNight: 18800,
    roomsAvailable: 10,
    amenities: ["Free WiFi", "Private Pool", "Garden", "Breakfast", "Parking"],
  },
];

/*
  IMPORTANT:
  1) Keep at least 12–18 images per location
  2) Do not keep only 5 images per location
  3) Each hotel will randomly get 5 unique images from its location pool
  4) Below I am showing enough structure + sample pools
  5) Continue the same way for all 20 locations
*/

const LOCATION_IMAGE_POOLS = {
  Bali: [
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
    "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg",
    "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg",
    "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  ],

  Bangkok: [
    "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    "https://images.pexels.com/photos/6466281/pexels-photo-6466281.jpeg",
    "https://images.pexels.com/photos/1560065/pexels-photo-1560065.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/5379237/pexels-photo-5379237.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  ],

  Dubai: [
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    "https://images.pexels.com/photos/7031408/pexels-photo-7031408.jpeg",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    "https://images.pexels.com/photos/5379237/pexels-photo-5379237.jpeg",
    "https://images.pexels.com/photos/8134848/pexels-photo-8134848.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
  ],

  Goa: [
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg",
    "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
    "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg",
    "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
  ],

  Greece: [
    "https://images.pexels.com/photos/161758/greece-boat-vacation-water-161758.jpeg",
    "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
    "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
    "https://images.pexels.com/photos/373290/pexels-photo-373290.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
    "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg",
  ],

  Jaipur: [
    "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg",
    "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg",
    "https://images.pexels.com/photos/784879/pexels-photo-784879.jpeg",
    "https://images.pexels.com/photos/2041556/pexels-photo-2041556.jpeg",
    "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],

  Kashmir: [
    "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg",
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
    "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg",
    "https://images.pexels.com/photos/730981/pexels-photo-730981.jpeg",
    "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  ],

  London: [
    "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
    "https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg",
    "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg",
    "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
  ],

  Maldives: [
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
    "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
    "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg",
    "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  ],

  Manali: [
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
    "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg",
    "https://images.pexels.com/photos/730981/pexels-photo-730981.jpeg",
    "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg",
    "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  ],

  "New York": [
    "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg",
    "https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg",
    "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg",
    "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],

  Paris: [
    "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg",
    "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg",
    "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg",
    "https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg",
    "https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],

  Rome: [
    "https://images.pexels.com/photos/753337/pexels-photo-753337.jpeg",
    "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg",
    "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg",
    "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg",
    "https://images.pexels.com/photos/161154/street-travel-city-italian-italy-161154.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],

  Shimla: [
    "https://images.pexels.com/photos/730981/pexels-photo-730981.jpeg",
    "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
    "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg",
    "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg",
    "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  ],

  Singapore: [
    "https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg",
    "https://images.pexels.com/photos/3152126/pexels-photo-3152126.jpeg",
    "https://images.pexels.com/photos/4491951/pexels-photo-4491951.jpeg",
    "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],

  Switzerland: [
    "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
    "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg",
    "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
    "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg",
    "https://images.pexels.com/photos/730981/pexels-photo-730981.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  ],

  Sydney: [
    "https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg",
    "https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg",
    "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
    "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg",
    "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
    "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
  ],

  Tokyo: [
    "https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg",
    "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg",
    "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg",
    "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg",
    "https://images.pexels.com/photos/2187662/pexels-photo-2187662.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],

  Turkey: [
    "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg",
    "https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg",
    "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg",
    "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    "https://images.pexels.com/photos/161758/greece-boat-vacation-water-161758.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],

  Venice: [
    "https://images.pexels.com/photos/161154/street-travel-city-italian-italy-161154.jpeg",
    "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg",
    "https://images.pexels.com/photos/753337/pexels-photo-753337.jpeg",
    "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg",
    "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  ],
};

const FALLBACK_HOTEL_IMAGES = [
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
  "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
  "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
  "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
  "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const makeDescription = (locationName, hotelType, hotelName) => {
  return `${hotelName} is a beautifully designed ${hotelType} hotel in ${locationName} offering elegant rooms, modern comfort, quality amenities, warm hospitality, and a relaxing stay experience for couples, families, and travelers.`;
};

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getUniqueImagesForHotel = (locationName, count = 5) => {
  const locationPool = LOCATION_IMAGE_POOLS[locationName] || [];
  const mergedPool = [...locationPool, ...FALLBACK_HOTEL_IMAGES];
  const uniquePool = [...new Set(mergedPool)];

  if (uniquePool.length < count) {
    throw new Error(`Not enough images available for ${locationName}`);
  }

  return shuffleArray(uniquePool).slice(0, count);
};

const isUrlWorking = async (url) => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

const uploadRemoteImageToCloudinary = async (
  imageUrl,
  hotelName,
  locationName,
  imageIndex,
  retries = 3,
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: "travel_app/hotels",
        public_id: `${slugify(locationName)}-${slugify(hotelName)}-${imageIndex}-${Date.now()}`,
        resource_type: "image",
      });

      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.log(
        `Upload failed for ${hotelName} image ${imageIndex}, attempt ${attempt}/${retries}`,
      );

      if (attempt === retries) {
        throw new Error(
          `Cloudinary upload failed for ${hotelName} image ${imageIndex}: ${error.message}`,
        );
      }

      await sleep(2000);
    }
  }
};

const removeOldHotelsAndImages = async () => {
  const oldHotels = await hotelModel.find({});
  for (const hotel of oldHotels) {
    const deletedIds = new Set();

    if (
      hotel?.thumbnail?.public_id &&
      !deletedIds.has(hotel.thumbnail.public_id)
    ) {
      await deleteImage(hotel.thumbnail.public_id);
      deletedIds.add(hotel.thumbnail.public_id);
    }

    if (hotel?.images?.length) {
      for (const image of hotel.images) {
        if (image?.public_id && !deletedIds.has(image.public_id)) {
          await deleteImage(image.public_id);
          deletedIds.add(image.public_id);
        }
      }
    }
  }

  await hotelModel.deleteMany({});
  console.log("Old hotels and Cloudinary images deleted");
};

const uploadFiveWorkingImages = async (hotelName, locationName) => {
  const candidateImages = getUniqueImagesForHotel(locationName, 8);
  const uploadedImages = [];

  for (let i = 0; i < candidateImages.length; i++) {
    if (uploadedImages.length === 5) break;

    const imageUrl = candidateImages[i];
    const working = await isUrlWorking(imageUrl);

    if (!working) {
      console.log(`Broken URL skipped for ${hotelName}: ${imageUrl}`);
      continue;
    }

    try {
      const uploaded = await uploadRemoteImageToCloudinary(
        imageUrl,
        hotelName,
        locationName,
        uploadedImages.length + 1,
      );

      uploadedImages.push(uploaded);
      console.log(
        `Uploaded ${uploadedImages.length}/5 images for ${hotelName}`,
      );
    } catch (error) {
      console.log(`Upload skipped for ${hotelName}: ${error.message}`);
    }
  }

  if (uploadedImages.length < 5) {
    const fallbackPool = shuffleArray(FALLBACK_HOTEL_IMAGES);

    for (let i = 0; i < fallbackPool.length; i++) {
      if (uploadedImages.length === 5) break;

      const imageUrl = fallbackPool[i];
      const working = await isUrlWorking(imageUrl);
      if (!working) continue;

      try {
        const uploaded = await uploadRemoteImageToCloudinary(
          imageUrl,
          hotelName,
          locationName,
          uploadedImages.length + 1,
        );

        uploadedImages.push(uploaded);
      } catch (error) {
        console.log(
          `Fallback upload failed for ${hotelName}: ${error.message}`,
        );
      }
    }
  }

  if (uploadedImages.length < 5) {
    throw new Error(`${hotelName} could not get 5 working images`);
  }

  return uploadedImages;
};

const prepareHotelsForLocation = async (locationDoc) => {
  const preparedHotels = [];

  for (let i = 0; i < HOTEL_BLUEPRINTS.length; i++) {
    const blueprint = HOTEL_BLUEPRINTS[i];
    const hotelName = `${locationDoc.name} ${blueprint.suffix}`;

    const uploadedImages = await uploadFiveWorkingImages(
      hotelName,
      locationDoc.name,
    );

    preparedHotels.push({
      name: hotelName,
      location: locationDoc._id,
      description: makeDescription(
        locationDoc.name,
        blueprint.hotelType,
        hotelName,
      ),
      rating: blueprint.rating,
      pricePerNight: blueprint.pricePerNight + i * 500,
      roomsAvailable: blueprint.roomsAvailable,
      amenities: blueprint.amenities,
      hotelType: blueprint.hotelType,
      thumbnail: uploadedImages[0],
      images: uploadedImages,
      isActive: true,
    });
  }

  return preparedHotels;
};

const seedHotels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected");

    await removeOldHotelsAndImages();

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

    const allHotels = [];

    for (const location of sortedLocations) {
      try {
        const hotels = await prepareHotelsForLocation(location);
        allHotels.push(...hotels);
        console.log(`Prepared 6 hotels for ${location.name}`);
      } catch (error) {
        console.log(`Failed for ${location.name}: ${error.message}`);
      }
    }

    if (!allHotels.length) {
      throw new Error("No hotels prepared for insertion");
    }

    await hotelModel.insertMany(allHotels);
    console.log(`Hotels inserted successfully: ${allHotels.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Hotel seeder failed:", error.message);
    process.exit(1);
  }
};

seedHotels();
