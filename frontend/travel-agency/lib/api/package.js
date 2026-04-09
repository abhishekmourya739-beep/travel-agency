import axiosInstance from "../axios";

export const getAllPackagesSearchData = async () => {
  try {
    const res = await axiosInstance.get("/packages/search_data");
    // console.log(res);

    return res?.data?.data?.packages || res?.data?.data || [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getPackages = async (params = {}) => {
  try {
    const res = await axiosInstance.get("/packages", { params });
    return res?.data?.data || { packages: [], pagination: {} };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getFeaturedPackages = async () => {
  try {
    const res = await axiosInstance.get("/packages/featured");
    return res?.data?.data || [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getPackageById = async (id) => {
  try {
    const res = await axiosInstance.get(`/packages/${id}`);
    // console.log(res);
    return res?.data?.data || null;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
