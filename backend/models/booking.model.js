import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    travelPackage: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "Package is required"],
      index: true,
    },

    travelDate: {
      type: Date,
      required: [true, "Travel date is required"],
    },

    numberOfPeople: {
      type: Number,
      required: [true, "Number of people is required"],
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: 1,
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "cash"],
      default: "card",
    },

    bookingId: {
      type: String,
      unique: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
