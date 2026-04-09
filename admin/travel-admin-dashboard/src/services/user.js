import axiosInstance from "./axios";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await axiosInstance.get(`/admin/users/${userId}`);
  return res.data;
};

export const createUser = async (formData) => {
  const res = await axiosInstance.post("/admin/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateUser = async (userId, formData) => {
  const res = await axiosInstance.put(`/admin/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await axiosInstance.delete(`/admin/users/${userId}`);
  return res.data;
};
