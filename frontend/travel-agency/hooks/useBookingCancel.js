"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/slices/toast.slice";
import { cancelBookingById } from "@/lib/api/booking";
import { getOptimisticCancelledBooking } from "@/lib/utils/booking";

export default function useBookingCancel({
  bookings = [],
  setBookings,
  setReduxBookings,
  booking = null,
  setBooking,
  successMessage = "Booking cancelled successfully",
}) {
  const dispatch = useAppDispatch();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState("");

  const openCancelModal = (bookingItem) => {
    setSelectedBooking(bookingItem);
    setConfirmOpen(true);
  };

  const closeCancelModal = () => {
    if (cancellingId) return;
    setConfirmOpen(false);
    setSelectedBooking(null);
  };

  const confirmCancel = async () => {
    const targetBooking = selectedBooking || booking;
    if (!targetBooking) return;

    const bookingId = targetBooking.bookingId;

    const previousBookings = Array.isArray(bookings) ? [...bookings] : [];
    const previousBooking = booking ? { ...booking } : null;

    try {
      setCancellingId(bookingId);

      if (Array.isArray(bookings) && setBookings) {
        const optimisticBookings = bookings.map((item) =>
          item.bookingId === bookingId
            ? getOptimisticCancelledBooking(item)
            : item,
        );

        setBookings(optimisticBookings);

        if (setReduxBookings) {
          setReduxBookings(optimisticBookings);
        }
      }

      if (booking && setBooking) {
        setBooking(getOptimisticCancelledBooking(booking));
      }

      await cancelBookingById(bookingId);

      dispatch(
        showToast({
          type: "success",
          message: successMessage,
        }),
      );

      setConfirmOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      if (Array.isArray(bookings) && setBookings) {
        setBookings(previousBookings);

        if (setReduxBookings) {
          setReduxBookings(previousBookings);
        }
      }

      if (booking && setBooking && previousBooking) {
        setBooking(previousBooking);
      }

      dispatch(
        showToast({
          type: "error",
          message: error?.message || "Failed to cancel booking",
        }),
      );
    } finally {
      setCancellingId("");
    }
  };

  return {
    confirmOpen,
    cancellingId,
    openCancelModal,
    closeCancelModal,
    confirmCancel,
  };
}
