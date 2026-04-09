export const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data?.errors?.[0]?.message ||
    err?.message ||
    "Something went wrong"
  );
};
