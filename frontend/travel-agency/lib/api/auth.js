import axiosInstance from "../axios";

export const loginUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendRegisterEmailOtp = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/send-register-email-otp", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyRegisterEmailOtp = async (data) => {
  try {
    const res = await axiosInstance.post(
      "/auth/verify-register-email-otp",
      data,
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const forgotPassword = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/forgot_password", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 2. verify OTP
export const verifyForgotPasswordOtp = async (data) => {
  try {
    const res = await axiosInstance.post(
      "/auth/verify_forgot_password_otp",
      data,
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/reset_password", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUser = async (data) => {
  try {
    const res = await axiosInstance.get("/user");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const res = await axiosInstance.put("/user", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const softDeleteAccount = async () => {
  try {
    const res = await axiosInstance.delete("/user");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const changePassword = async (data) => {
  try {
    const res = await axiosInstance.put("/user/change_password", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLoginSessions = async () => {
  try {
    const res = await axiosInstance.get("/user/login_sessions");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getConnectedAccounts = async () => {
  try {
    const res = await axiosInstance.get("/user/connected_accounts");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const sendEmailVerificationOtp = async () => {
  try {
    const res = await axiosInstance.post("/auth/send_email_verification_otp");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyEmailOtp = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/verify_email_otp", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
