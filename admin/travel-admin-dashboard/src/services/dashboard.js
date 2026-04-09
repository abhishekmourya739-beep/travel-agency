import axiosInstance from "./axios";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/bookings/dashboard/stats");
  return response.data;
};
