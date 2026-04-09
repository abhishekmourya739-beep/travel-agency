import axiosInstance from "./axios";

export const adminLogin = async (formData) => {
  const response = await axiosInstance.post("/auth/admin/login", formData);
  return response.data;
};
