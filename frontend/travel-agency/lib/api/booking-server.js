import { serverRequest } from "./server-request";

export const getMyBookingsServer = async () => {
  try {
    return await serverRequest({
      endpoint: "/bookings",
    });
  } catch (error) {
    throw error?.response?.data || error.message;
  }
};

export const getBookingByIdServer = async (bookingId) => {
  try {
    return await serverRequest({
      endpoint: `/bookings/${bookingId}`,
    });
  } catch (error) {
    throw error?.response?.data || error.message;
  }
};
