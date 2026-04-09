import axios from "axios";

function clearAdminAuth() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUser");
}

function redirectToLogin() {
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
}

function isAuthError(error) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message?.toLowerCase?.() || "";

  return (
    status === 401 ||
    status === 403 ||
    message.includes("invalid token") ||
    message.includes("jwt expired") ||
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("token expired")
  );
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAuthError(error)) {
      clearAdminAuth();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
