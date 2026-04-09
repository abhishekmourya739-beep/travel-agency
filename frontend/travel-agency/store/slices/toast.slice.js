import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  show: false,
  type: "success",
  // type can be success,error,warning
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.show = true;
      state.type = action.payload.type || "success";
    },
    hideToast: (state) => {
      state.message = "";
      state.show = false;
      state.type = "success";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
const toastReducer = toastSlice.reducer;
export default toastReducer;
