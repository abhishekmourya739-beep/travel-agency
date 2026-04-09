import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slices/toast.slice";
import wishlistReducer from "./slices/wishlistSlice";
import bookingReducer from "./slices/bookingSlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    wishlist: wishlistReducer,
    booking: bookingReducer,
    ui: uiReducer,
  },
});

export default store;
