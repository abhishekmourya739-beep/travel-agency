export function formatBookingCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatBookingDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getBookingStatusClasses(status) {
  const value = (status || "").toLowerCase();

  if (value === "confirmed") {
    return "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  if (value === "cancelled") {
    return "border border-rose-400/30 bg-rose-400/10 text-rose-200";
  }

  if (value === "completed") {
    return "border border-violet-400/30 bg-violet-400/10 text-violet-200";
  }

  return "border border-white/15 bg-white/10 text-white/75";
}

export function getBookingPaymentClasses(status) {
  const value = (status || "").toLowerCase();

  if (value === "paid") {
    return "border border-sky-400/30 bg-sky-400/10 text-sky-200";
  }

  if (value === "refunded") {
    return "border border-amber-400/30 bg-amber-400/10 text-amber-200";
  }

  if (value === "failed") {
    return "border border-rose-400/30 bg-rose-400/10 text-rose-200";
  }

  return "border border-white/15 bg-white/10 text-white/75";
}

export function canCancelBooking(booking) {
  const bookingStatus = (booking?.bookingStatus || "").toLowerCase();
  const paymentStatus = (booking?.paymentStatus || "").toLowerCase();

  if (bookingStatus === "cancelled" || bookingStatus === "completed") {
    return false;
  }

  if (paymentStatus === "failed") {
    return false;
  }

  return true;
}

export function getOptimisticCancelledBooking(booking) {
  return {
    ...booking,
    bookingStatus: "cancelled",
    paymentStatus:
      booking?.paymentStatus === "paid" ? "refunded" : booking?.paymentStatus,
  };
}
