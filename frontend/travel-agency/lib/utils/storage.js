export const storageKeys = {
  wishlist: "travel_app_wishlist",
  bookingDraft: "travel_app_booking_draft",
  bookingCache: "travel_app_booking_cache",
};

export function getStorageItem(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeStorageItem(key) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch {}
}
