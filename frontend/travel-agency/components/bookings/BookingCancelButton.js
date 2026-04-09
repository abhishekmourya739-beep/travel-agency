"use client";

import { XCircle } from "lucide-react";

export default function BookingCancelButton({
  booking,
  cancellingId,
  onCancel,
  className = "",
}) {
  if (!booking) return null;

  const isCancelling = cancellingId === booking.bookingId;

  return (
    <button
      type="button"
      onClick={() => onCancel(booking)}
      disabled={isCancelling}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <XCircle className="h-4 w-4" />
      {isCancelling ? "Cancelling..." : "Cancel"}
    </button>
  );
}
