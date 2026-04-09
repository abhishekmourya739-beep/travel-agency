"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Ticket } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBookings } from "@/store/slices/bookingSlice";
import BookingSummaryCard from "./BookingSummaryCard";
import useBookingCancel from "@/hooks/useBookingCancel";
import { formatBookingCurrency } from "@/lib/utils/booking";
import ConfirmDialog from "../global/confirmDialog";

export default function MyBookingsPageClient({ initialBookings = [] }) {
  const dispatch = useAppDispatch();
  const [localBookings, setLocalBookings] = useState([]);

  useEffect(() => {
    const safeBookings = Array.isArray(initialBookings) ? initialBookings : [];
    setLocalBookings(safeBookings);
    dispatch(setBookings(safeBookings));
  }, [initialBookings, dispatch]);

  const bookings = localBookings;

  const {
    confirmOpen,
    cancellingId,
    openCancelModal,
    closeCancelModal,
    confirmCancel,
  } = useBookingCancel({
    bookings: localBookings,
    setBookings: setLocalBookings,
    setReduxBookings: (updated) => dispatch(setBookings(updated)),
  });

  const stats = useMemo(() => {
    const total = bookings?.length || 0;
    const confirmed =
      bookings?.filter((b) => b.bookingStatus === "confirmed").length || 0;
    const paid =
      bookings?.filter((b) => b.paymentStatus === "paid").length || 0;

    const spent =
      bookings?.reduce((sum, b) => {
        if (b.paymentStatus === "paid") return sum + (b.totalPrice || 0);
        return sum;
      }, 0) || 0;

    return { total, confirmed, paid, spent };
  }, [bookings]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.10),transparent_28%),linear-gradient(to_bottom,#050816,#0b1020,#050816)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300/10 via-transparent to-sky-300/10" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                  <Sparkles className="h-4 w-4" />
                  My Bookings
                </div>

                <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  Your luxury travel history, beautifully organized.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                  Track your confirmed stays, premium trips, payment status, and
                  upcoming departures in one elegant dashboard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Total
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {stats.total}
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs uppercase text-white/45">Confirmed</p>
                  <h3 className="mt-2 text-2xl font-semibold text-emerald-200">
                    {stats.confirmed}
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Paid
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-sky-200">
                    {stats.paid}
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Total Spend
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-amber-200">
                    {formatBookingCurrency(stats.spent)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {bookings?.length ? (
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => (
              <BookingSummaryCard
                key={booking._id || booking.bookingId}
                booking={booking}
                cancellingId={cancellingId}
                onCancel={openCancelModal}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-12 text-center shadow-[0_18px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10">
              <Ticket className="h-9 w-9 text-amber-200" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold text-white">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-white/65">
              Your luxury experiences will appear here once you reserve a travel
              package.
            </p>

            <Link
              href="/packages"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              Explore Packages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, cancel it"
        cancelText="Keep booking"
        loading={!!cancellingId}
        onConfirm={confirmCancel}
        onClose={closeCancelModal}
      />
    </section>
  );
}
