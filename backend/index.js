//Importing env.js this should always be on top
import "./config/env.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/admin/user.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoute from "./routes/auth/auth.route.js";
import profileRoute from "./routes/user/profile.route.js";
import locationRoute from "./routes/admin/location.route.js";
import userlocationRoute from "./routes/user/location.route.js";
import hotelRoute from "./routes/admin/hotel.route.js";
import userhotelRoute from "./routes/user/hotel.route.js";
import packageRoute from "./routes/admin/package.route.js";
import userpackageRoute from "./routes/user/package.route.js";
import userbookingRoute from "./routes/user/booking.route.js";
import bookingRoute from "./routes/admin/booking.route.js";
import paymentRoute from "./routes/payment.route.js";
import profileRoutes from "./routes/admin/profile.route.js";

const app = express();
const port = process.env.PORT;
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://abhishek-travel-admin.netlify.app/",
    ],
    credentials: true,
  }),
);
//express middleware
app.use(express.json());

//mongoose database connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected!"));

//start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

//routes
app.use("/api/v1/admin/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", profileRoute);
app.use("/api/v1/admin/locations", locationRoute);
app.use("/api/v1/locations", userlocationRoute);
app.use("/api/v1/admin/hotels", hotelRoute);
app.use("/api/v1/hotels", userhotelRoute);
app.use("/api/v1/admin/packages", packageRoute);
app.use("/api/v1/packages", userpackageRoute);
app.use("/api/v1/admin/bookings", bookingRoute);

app.use("/api/v1/bookings", userbookingRoute);
app.use("/api/v1/payment", paymentRoute);

app.use("/api/v1/admin/profile", profileRoutes);

//global error middleware
app.use(errorMiddleware);
