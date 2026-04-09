import { createSlice } from "@reduxjs/toolkit";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  storageKeys,
} from "@/lib/utils/storage";

const initialState = {
  draft: null,
  bookings: [],
  loading: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    hydrateBookingState: (state) => {
      state.draft = getStorageItem(storageKeys.bookingDraft, null);
      state.bookings = getStorageItem(storageKeys.bookingCache, []);
    },

    setBookingDraft: (state, action) => {
      state.draft = action.payload;
      setStorageItem(storageKeys.bookingDraft, action.payload);
    },

    clearBookingDraft: (state) => {
      state.draft = null;
      removeStorageItem(storageKeys.bookingDraft);
    },

    setBookings: (state, action) => {
      state.bookings = action.payload || [];
      setStorageItem(storageKeys.bookingCache, state.bookings);
    },

    addBookingToCache: (state, action) => {
      const exists = state.bookings.some(
        (item) => item._id === action.payload?._id,
      );

      if (!exists) {
        state.bookings.unshift(action.payload);
      }

      setStorageItem(storageKeys.bookingCache, state.bookings);
    },

    setBookingLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearBookingsCache: (state) => {
      state.bookings = [];
      removeStorageItem(storageKeys.bookingCache);
    },
  },
});

export const {
  hydrateBookingState,
  setBookingDraft,
  clearBookingDraft,
  setBookings,
  addBookingToCache,
  setBookingLoading,
  clearBookingsCache,
} = bookingSlice.actions;
const bookingReducer = bookingSlice.reducer;

export default bookingReducer;
