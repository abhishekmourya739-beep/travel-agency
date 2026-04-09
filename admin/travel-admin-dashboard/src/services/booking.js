import axiosInstance from "./axios";

export const getAllBookings = async () => {
  return axiosInstance.get("/admin/bookings");
};

export const getBookingById = async (bookingId) => {
  return axiosInstance.get(`/admin/bookings/${bookingId}`);
};

export const updateBooking = async (bookingId, payload) => {
  return axiosInstance.patch(`/admin/bookings/${bookingId}`, payload);
};
