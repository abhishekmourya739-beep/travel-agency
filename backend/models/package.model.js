import mongoose from "mongoose";
const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
      minLength: 3,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: 30,
    },

    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required"],
      index: true,
    },

    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "Hotel is required"],
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Package price is required"],
      min: 1,
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: 1,
    },

    tripType: {
      type: String,
      enum: ["adventure", "cultural", "relaxation", "family", "honeymoon"],
      required: [true, "Trip type is required"],
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
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    itinerary: [
      {
        day: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Package", packageSchema);
