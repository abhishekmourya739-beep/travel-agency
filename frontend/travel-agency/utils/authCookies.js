export const setAuthCookie = (token) => {
  if (typeof document !== "undefined") {
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
  }
};

export const removeAuthCookie = () => {
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; max-age=0; samesite=lax";
  }
};
