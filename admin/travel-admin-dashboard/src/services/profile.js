import axiosInstance from "./axios";

export const getMyProfile = async () => {
  const res = await axiosInstance.get("/admin/profile/me");
  return res.data;
};

export const updateMyProfile = async (formData) => {
  const res = await axiosInstance.put("/admin/profile/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const changeMyPassword = async (payload) => {
  const res = await axiosInstance.put(
    "/admin/profile/change-password",
    payload,
  );
  return res.data;
};
