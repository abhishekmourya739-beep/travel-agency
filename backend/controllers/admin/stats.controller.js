import bookingModel from "../../models/booking.model";
import packageModel from "../../models/package.model";
import userModel from "../../models/user.model";
import apiResponse from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import mongoose from "mongoose";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalBookings,
    totalPackages,
    totalPaidBookings,
    totalPendingBookings,
    totalCancelledBookings,
    totalPendingPayments,
    totalFailedPayments,
    latestUsers,
    latestBookings,
    latestPackages,
    revenueAgg,
    monthlyRevenueAgg,
    bookingStatusAgg,
    paymentStatusAgg,
    topPackagesAgg,
  ] = await Promise.all([
    userModel.countDocuments(),
    bookingModel.countDocuments(),
    packageModel.countDocuments(),

    bookingModel.countDocuments({ paymentStatus: "paid" }),
    bookingModel.countDocuments({ bookingStatus: "pending" }),
    bookingModel.countDocuments({ bookingStatus: "cancelled" }),

    bookingModel.countDocuments({ paymentStatus: "pending" }),
    bookingModel.countDocuments({ paymentStatus: "failed" }),

    userModel
      .find()
      .select("name email image createdAt")
      .sort({ createdAt: -1 })
      .limit(5),

    bookingModel
      .find()
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "travelPackage",
        select: "title price thumbnail",
      })
      .select(
        "bookingId totalPrice bookingStatus paymentStatus numberOfPeople travelDate createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(6),

    packageModel
      .find()
      .select("title price duration tripType thumbnail createdAt")
      .sort({ createdAt: -1 })
      .limit(5),

    bookingModel.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]),

    bookingModel.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),

    bookingModel.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 },
        },
      },
    ]),

    bookingModel.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]),

    bookingModel.aggregate([
      {
        $group: {
          _id: "$travelPackage",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { totalBookings: -1, totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $unwind: "$package",
      },
      {
        $project: {
          _id: 0,
          packageId: "$package._id",
          title: "$package.title",
          price: "$package.price",
          thumbnail: "$package.thumbnail",
          totalBookings: 1,
          totalRevenue: 1,
        },
      },
    ]),
  ]);

  const totalRevenue = revenueAgg?.[0]?.totalRevenue || 0;

  const bookingPerUser =
    totalUsers > 0 ? Number((totalBookings / totalUsers).toFixed(2)) : 0;

  const revenuePerBooking =
    totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  const conversionRate =
    totalBookings > 0
      ? Number(((totalPaidBookings / totalBookings) * 100).toFixed(1))
      : 0;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyRevenueMap = new Map(
    monthlyRevenueAgg.map((item) => [
      item._id,
      {
        month: monthNames[item._id - 1],
        revenue: item.revenue,
        bookings: item.bookings,
      },
    ]),
  );

  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = i + 1;
    return (
      monthlyRevenueMap.get(monthIndex) || {
        month: monthNames[i],
        revenue: 0,
        bookings: 0,
      }
    );
  });

  return apiResponse(res, 200, "Dashboard stats fetched successfully", {
    overview: {
      totalUsers,
      totalBookings,
      totalPackages,
      totalRevenue,
      totalPaidBookings,
      totalPendingBookings,
      totalCancelledBookings,
      totalPendingPayments,
      totalFailedPayments,
      bookingPerUser,
      revenuePerBooking,
      conversionRate,
    },
    charts: {
      monthlyRevenue,
      bookingStatus: bookingStatusAgg.map((item) => ({
        name: item._id || "unknown",
        value: item.count,
      })),
      paymentStatus: paymentStatusAgg.map((item) => ({
        name: item._id || "unknown",
        value: item.count,
      })),
    },
    recent: {
      latestUsers,
      latestBookings,
      latestPackages,
    },
    topPackages: topPackagesAgg,
  });
});
