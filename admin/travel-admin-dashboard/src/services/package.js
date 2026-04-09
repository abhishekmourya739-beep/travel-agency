import axiosInstance from "./axios";

export const getAllPackages = async () => {
  const response = await axiosInstance.get("/admin/packages");
  return response.data;
};
export const createPackage = async (data) => {
  const res = await axiosInstance.post("/admin/packages", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
export const updatePackage = async (id, data) => {
  const res = await axiosInstance.put(`/admin/packages/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deletePackage = async (id) => {
  const res = await axiosInstance.delete(`/admin/packages/${id}`);
  return res.data;
};
