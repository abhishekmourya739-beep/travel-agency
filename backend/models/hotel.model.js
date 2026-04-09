import mongoose from "mongoose";
const Schema = mongoose.Schema;
const hotelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      minLength: 3,
      index: true,
    },

    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required"],
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: 30,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: 1,
    },

    roomsAvailable: {
      type: Number,
      required: [true, "Rooms available is required"],
      min: 0,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    hotelType: {
      type: String,
      enum: ["budget", "standard", "luxury", "resort", "villa"],
      default: "standard",
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Hotel", hotelSchema);
