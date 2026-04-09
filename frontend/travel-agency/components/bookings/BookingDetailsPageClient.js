"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  BadgeIndianRupee,
  MapPin,
  CreditCard,
  Hotel,
  Star,
  ArrowLeft,
} from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingPaymentBadge from "./BookingPaymentBadge";
import BookingCancelButton from "./BookingCancelButton";
import useBookingCancel from "@/hooks/useBookingCancel";
import {
  canCancelBooking,
  formatBookingCurrency,
  formatBookingDate,
} from "@/lib/utils/booking";
import ConfirmDialog from "../global/confirmDialog";

export default function BookingDetailsPageClient({ booking: initialBooking }) {
  const [booking, setBooking] = useState(initialBooking);

  const {
    confirmOpen,
    cancellingId,
    openCancelModal,
    closeCancelModal,
    confirmCancel,
  } = useBookingCancel({
    booking,
    setBooking,
  });

  if (!booking) {
    return (
      <section className="min-h-screen bg-[#060816] px-4 pt-28 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/5 p-10 text-center">
          <h1 className="text-3xl font-semibold">Booking not found</h1>
          <Link
            href="/my-bookings"
            className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900"
          >
            Back to Bookings
          </Link>
        </div>
      </section>
    );
  }

  const image =
    booking?.travelPackage?.thumbnail?.url ||
    booking?.travelPackage?.location?.image?.url ||
    "/hero2.jpg";

  return (
    <section className="min-h-screen bg-[#060816] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 md:px-6 lg:px-8">
        <Link
          href="/my-bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="relative h-[320px]">
            <Image
              src={image}
              alt={booking?.travelPackage?.title || "Booking"}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-200">
                Booking Details
              </p>
              <h1 className="mt-3 text-3xl font-semibold md:text-5xl">
                {booking?.travelPackage?.title}
              </h1>
              <p className="mt-3 text-white/75">{booking?.bookingId}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <BookingStatusBadge status={booking?.bookingStatus} />
                <BookingPaymentBadge status={booking?.paymentStatus} />

                {canCancelBooking(booking) && (
                  <BookingCancelButton
                    booking={booking}
                    cancellingId={cancellingId}
                    onCancel={openCancelModal}
                    className="px-5"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-xl font-semibold">Trip Information</h2>

                <div className="mt-5 space-y-4 text-white/75">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-amber-200" />
                    <span>{formatBookingDate(booking?.travelDate)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-sky-200" />
                    <span>{booking?.numberOfPeople} Travelers</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <BadgeIndianRupee className="h-5 w-5 text-emerald-200" />
                    <span>{formatBookingCurrency(booking?.totalPrice)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-rose-200" />
                    <span>
                      {booking?.travelPackage?.location?.name || "Destination"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-violet-200" />
                    <span className="capitalize">
                      {booking?.paymentMethod || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-xl font-semibold">Booking Status</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  <BookingStatusBadge status={booking?.bookingStatus} />
                  <BookingPaymentBadge status={booking?.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-xl font-semibold">Package Overview</h2>
                <p className="mt-4 leading-7 text-white/70">
                  {booking?.travelPackage?.description ||
                    "No description available"}
                </p>
              </div>

              {booking?.travelPackage?.hotel && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <h2 className="text-xl font-semibold">Hotel</h2>

                  <div className="mt-4 space-y-3 text-white/75">
                    <div className="flex items-center gap-3">
                      <Hotel className="h-5 w-5 text-amber-200" />
                      <span>{booking?.travelPackage?.hotel?.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-200" />
                      <span>
                        {booking?.travelPackage?.hotel?.rating || 0} Rating
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
