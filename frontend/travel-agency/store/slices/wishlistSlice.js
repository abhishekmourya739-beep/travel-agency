import { createSlice } from "@reduxjs/toolkit";
import {
  getStorageItem,
  setStorageItem,
  storageKeys,
} from "@/lib/utils/storage";

const initialState = {
  items: [],
};

const persistWishlist = (items) => {
  setStorageItem(storageKeys.wishlist, items);
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrateWishlist: (state) => {
      state.items = getStorageItem(storageKeys.wishlist, []);
    },

    toggleWishlistItem: (state, action) => {
      const item = action.payload;
      const exists = state.items.some((i) => i._id === item._id);

      if (exists) {
        state.items = state.items.filter((i) => i._id !== item._id);
      } else {
        state.items.unshift(item);
      }

      persistWishlist(state.items);
    },

    removeWishlistItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      persistWishlist(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      persistWishlist(state.items);
    },
  },
});

export const {
  hydrateWishlist,
  toggleWishlistItem,
  removeWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;
const wishlistReducer = wishlistSlice.reducer;

export default wishlistReducer;
