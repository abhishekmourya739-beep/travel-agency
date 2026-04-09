import { toast } from "react-toastify";

const baseConfig = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const showSuccess = (message = "Success") => {
  toast.success(message, baseConfig);
};

export const showError = (message = "Something went wrong") => {
  toast.error(message, baseConfig);
};

export const showInfo = (message = "Info") => {
  toast.info(message, baseConfig);
};

export const showWarning = (message = "Warning") => {
  toast.warning(message, baseConfig);
};
