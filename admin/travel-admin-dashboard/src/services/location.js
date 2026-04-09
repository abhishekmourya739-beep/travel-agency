import axiosInstance from "./axios";

export const getAllLocations = async () => {
  return axiosInstance.get("/admin/locations");
};

export const getLocationById = async (locationId) => {
  return axiosInstance.get(`/admin/locations/${locationId}`);
};

export const createLocation = async (formData) => {
  return axiosInstance.post("/admin/locations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateLocation = async (locationId, formData) => {
  return axiosInstance.put(`/admin/locations/${locationId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteLocation = async (locationId) => {
  return axiosInstance.delete(`/admin/locations/${locationId}`);
};
