import axiosInstance from "./axios";

export const getAllHotels = async () => {
  const res = await axiosInstance.get("/admin/hotels");
  return res.data;
};

export const getHotelById = async (hotelId) => {
  const res = await axiosInstance.get(`/admin/hotels/${hotelId}`);
  return res.data;
};

export const createHotel = async (formData) => {
  const res = await axiosInstance.post("/admin/hotels", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateHotel = async (hotelId, formData) => {
  const res = await axiosInstance.put(`/admin/hotels/${hotelId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteHotel = async (hotelId) => {
  const res = await axiosInstance.delete(`/admin/hotels/${hotelId}`);
  return res.data;
};
