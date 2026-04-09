import axiosInstance from "../axios";

export const createPaymentOrder = async (bookingId) => {
  try {
    const res = await axiosInstance.post(`/payment/create_order/${bookingId}`);
    return res?.data?.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyPayment = async (payload) => {
  try {
    const res = await axiosInstance.post(`/payment/verify`, payload);
    return res?.data?.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
