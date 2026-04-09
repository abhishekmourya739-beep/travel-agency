"use client";

import { Provider } from "react-redux";
import store from "./store";
import { useEffect } from "react";
import { hydrateWishlist } from "./slices/wishlistSlice";
import { hydrateBookingState } from "./slices/bookingSlice";
function BootstrapStore() {
  useEffect(() => {
    store.dispatch(hydrateWishlist());
    store.dispatch(hydrateBookingState());
  }, []);

  return null;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <BootstrapStore />
      {children}
    </Provider>
  );
}
