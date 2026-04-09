"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  BadgeIndianRupee,
  MapPin,
  CreditCard,
  Clock3,
  ArrowRight,
  Ticket,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import BookingCancelButton from "./BookingCancelButton";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingPaymentBadge from "./BookingPaymentBadge";
import {
  canCancelBooking,
  formatBookingCurrency,
  formatBookingDate,
} from "@/lib/utils/booking";

export default function BookingSummaryCard({
  booking,
  cancellingId,
  onCancel,
}) {
  const packageImage =
    booking?.travelPackage?.thumbnail?.url ||
    booking?.travelPackage?.location?.image?.url ||
    "/hero2.jpg";

  const canCancel = canCancelBooking(booking);

  return (
    <article className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-amber-300/30">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={packageImage}
          alt={booking?.travelPackage?.title || "Booking"}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-white/85 backdrop-blur-md">
            {booking.bookingId}
          </span>

          <div className="flex flex-wrap justify-end gap-2">
            <BookingStatusBadge status={booking.bookingStatus} />
            <BookingPaymentBadge status={booking.paymentStatus} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-amber-200/90">
            Premium Journey
          </p>
          <h2 className="line-clamp-2 text-2xl font-semibold text-white">
            {booking?.travelPackage?.title || "Travel Package"}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-amber-200" />
            <span>
              {booking?.travelPackage?.location?.name || "Destination"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-white/55">
              <CalendarDays className="h-4 w-4 text-amber-200" />
              <span className="text-xs uppercase tracking-[0.18em]">
                Travel Date
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-white">
              {formatBookingDate(booking.travelDate)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-white/55">
              <Users className="h-4 w-4 text-sky-200" />
              <span className="text-xs uppercase tracking-[0.18em]">
                Travelers
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-white">
              {booking.numberOfPeople} People
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-white/55">
              <BadgeIndianRupee className="h-4 w-4 text-emerald-200" />
              <span className="text-xs uppercase tracking-[0.18em]">
                Total Paid
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-white">
              {formatBookingCurrency(booking.totalPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-white/55">
              <CreditCard className="h-4 w-4 text-violet-200" />
              <span className="text-xs uppercase tracking-[0.18em]">
                Payment
              </span>
            </div>
            <p className="mt-2 text-sm font-medium capitalize text-white">
              {booking.paymentMethod || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-white/65">
            <Clock3 className="h-4 w-4 text-amber-200" />
            Booked on {formatBookingDate(booking.createdAt)}
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            Secured
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/my-bookings/${booking.bookingId}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 px-4 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:scale-[1.01]"
          >
            <Ticket className="h-4 w-4" />
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>

          {canCancel && (
            <BookingCancelButton
              booking={booking}
              cancellingId={cancellingId}
              onCancel={onCancel}
              className="min-w-[130px] px-5"
            />
          )}
        </div>
      </div>
    </article>
  );
}
