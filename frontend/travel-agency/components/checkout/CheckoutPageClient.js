"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

import {
  CalendarDays,
  Users,
  MapPin,
  ShieldCheck,
  CreditCard,
  Landmark,
  Wallet,
  Smartphone,
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
  BadgeIndianRupee,
  CheckCircle2,
  X,
  AlertCircle,
  Lock,
  Clock3,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addBookingToCache,
  clearBookingDraft,
  setBookingLoading,
} from "@/store/slices/bookingSlice";
import { createBooking } from "@/lib/api/booking";
import { createPaymentOrder, verifyPayment } from "@/lib/api/payment";
import { loadRazorpayScript } from "@/lib/utils/loadRazorpay";

const paymentOptions = [
  {
    id: "card",
    title: "Credit / Debit Card",
    subtitle: "Pay securely using Visa, Mastercard, RuPay and more.",
    icon: CreditCard,
    accent: "from-sky-500/20 to-cyan-500/20",
  },
  {
    id: "upi",
    title: "UPI",
    subtitle: "Fast and seamless payments with UPI apps.",
    icon: Smartphone,
    accent: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    id: "netbanking",
    title: "Net Banking",
    subtitle: "Direct payment from your preferred bank account.",
    icon: Landmark,
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "wallet",
    title: "Wallet",
    subtitle: "Use supported digital wallets for quick checkout.",
    icon: Wallet,
    accent: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "cash",
    title: "Reserve Now, Pay Later",
    subtitle: "Confirm your booking now and complete payment offline.",
    icon: BadgeIndianRupee,
    accent: "from-rose-500/20 to-pink-500/20",
  },
];

function getErrorMessage(err) {
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  if (Array.isArray(err?.errors) && err.errors.length > 0) {
    return err.errors[0]?.msg || "Something went wrong";
  }
  return "Something went wrong. Please try again.";
}

function PaymentCard({ option, selected, onSelect }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-300 ${
        selected
          ? "border-cyan-400 bg-slate-950 text-white shadow-[0_20px_60px_rgba(6,182,212,0.18)]"
          : "border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100 ${
          selected ? option.accent : "from-transparent to-transparent"
        }`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              selected ? "bg-white/10" : "bg-slate-100"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                selected ? "text-cyan-300" : "text-slate-700"
              }`}
            />
          </div>

          {selected && <CheckCircle2 className="h-5 w-5 text-cyan-300" />}
        </div>

        <h3 className="mt-4 text-base font-bold">{option.title}</h3>
        <p
          className={`mt-2 text-sm leading-6 ${
            selected ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {option.subtitle}
        </p>
      </div>
    </button>
  );
}

function CalendarModal({ open, onClose, selectedDate, onSelect }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Select Date
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Choose your travel date
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onSelect(date);
              onClose();
            }}
            disabled={{ before: new Date() }}
            className="premium-day-picker"
          />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPageClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { draft, loading } = useAppSelector((state) => state.booking);

  const [travelDate, setTravelDate] = useState(
    draft?.travelDate ? new Date(draft.travelDate) : null,
  );
  const [numberOfPeople, setNumberOfPeople] = useState(
    Number(draft?.numberOfPeople || 1),
  );
  const [paymentMethod, setPaymentMethod] = useState(draft?.paymentMethod);
  const [error, setError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isOnlinePayment = ["card", "upi", "netbanking", "wallet"].includes(
    paymentMethod,
  );

  const totalPrice = useMemo(() => {
    return Number(draft?.packagePrice || 0) * Number(numberOfPeople || 1);
  }, [draft?.packagePrice, numberOfPeople]);

  const taxesAndFees = useMemo(() => {
    return Math.round(totalPrice * 0.05);
  }, [totalPrice]);

  const finalTotal = totalPrice + taxesAndFees;

  const handleCheckout = async () => {
    try {
      setError("");

      if (!draft?.travelPackage) {
        setError("No package selected. Please book a package first.");
        return;
      }

      if (!travelDate) {
        setError("Please select your travel date.");
        return;
      }

      if (numberOfPeople < 1) {
        setError("Number of people must be at least 1.");
        return;
      }

      dispatch(setBookingLoading(true));

      const booking = await createBooking({
        travelPackage: draft.travelPackage,
        travelDate: format(travelDate, "yyyy-MM-dd"),
        numberOfPeople,
        paymentMethod,
      });

      if (!isOnlinePayment) {
        dispatch(addBookingToCache(booking));
        dispatch(clearBookingDraft());
        router.push("/my-bookings");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const order = await createPaymentOrder(booking.bookingId);

      const options = {
        key: order?.key,
        amount: order?.amount,
        currency: order?.currency,
        order_id: order?.orderId,
        name: "Travel Agency",
        description: draft?.packageTitle || "Travel Package Booking",
        notes: {
          bookingId: booking.bookingId,
          paymentMethod,
          packageTitle: draft?.packageTitle || "",
        },
        theme: {
          color: "#0f172a",
        },
        handler: async function (response) {
          try {
            const verifiedBooking = await verifyPayment({
              ...response,
              bookingId: booking.bookingId,
            });

            dispatch(addBookingToCache(verifiedBooking));
            dispatch(clearBookingDraft());
            router.push("/my-bookings");
          } catch (verifyErr) {
            setError(getErrorMessage(verifyErr));
          }
        },
        modal: {
          ondismiss: function () {
            dispatch(setBookingLoading(false));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      dispatch(setBookingLoading(false));
    }
  };

  if (!draft) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.15),transparent_25%),linear-gradient(135deg,#020617,#0f172a,#1e293b)] px-10 py-20">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <div className="w-full max-w-xl rounded-[36px] border border-white/10 bg-white/10 p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">
              No booking selected
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Please choose a travel package before moving to checkout.
            </p>
            <button
              onClick={() => router.push("/packages")}
              className="mt-8 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02]"
            >
              Explore Packages
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDate={travelDate}
        onSelect={setTravelDate}
      />

      <section className="relative min-h-screen pt-10 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.16),transparent_20%),radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_18%),linear-gradient(135deg,#020617,#0f172a,#1e293b)]">
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[72px_72px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Checkout
              </p>
              <h1 className="mt-3 text-3xl font-bold text-white md:text-5xl">
                Finalize Your Premium Journey
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Complete your reservation with secure payment, elegant details,
                and a smooth premium booking experience.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur-xl">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                End-to-end secure checkout
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="rounded-[36px] border border-white/10 bg-white/[0.08] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-6">
              <div className="rounded-[30px] border border-white/60 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                      <Sparkles className="h-4 w-4 text-cyan-600" />
                      Guest Details
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
                      Complete your reservation
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Select travel date, travelers, and your preferred payment
                      method.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
                    <span className="inline-flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Protected checkout
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Travel Date
                    </label>

                    <button
                      type="button"
                      onClick={() => setCalendarOpen(true)}
                      className="group flex h-14 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-left transition hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                    >
                      <span className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-slate-400 transition group-hover:text-cyan-600" />
                        <span className="text-sm font-medium text-slate-900">
                          {travelDate
                            ? format(travelDate, "dd MMMM yyyy")
                            : "Choose your travel date"}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Travelers
                    </label>

                    <div className="flex h-14 items-center justify-between rounded-2xl border border-slate-200 bg-white px-3">
                      <button
                        type="button"
                        onClick={() =>
                          setNumberOfPeople((prev) => Math.max(1, prev - 1))
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-cyan-600" />
                        <span className="text-base font-semibold text-slate-900">
                          {numberOfPeople}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setNumberOfPeople((prev) => prev + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-semibold text-slate-700">
                    Choose Payment Method
                  </label>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {paymentOptions.map((option) => (
                      <PaymentCard
                        key={option.id}
                        option={option}
                        selected={paymentMethod === option.id}
                        onSelect={setPaymentMethod}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <ShieldCheck className="h-5 w-5 text-cyan-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Secure Payments
                    </p>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      Safe gateway and protected transaction flow.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Clock3 className="h-5 w-5 text-cyan-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Fast Confirmation
                    </p>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      Instant booking confirmation for online payments.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Sparkles className="h-5 w-5 text-cyan-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Premium Experience
                    </p>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      Luxury-focused booking flow for a polished experience.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || !travelDate}
                  className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-700 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(8,15,35,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading
                    ? "Processing your reservation..."
                    : isOnlinePayment
                      ? "Confirm & Pay Securely"
                      : "Confirm Reservation"}
                  {!loading && <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <div className="relative h-72">
                  <Image
                    src={draft?.thumbnail || "/hero2.jpg"}
                    alt={draft?.packageTitle || "Package image"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                      Selected Package
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {draft?.packageTitle}
                    </h2>
                  </div>
                </div>

                <div className="p-6 text-white">
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-5">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-slate-300">
                          <MapPin className="h-4 w-4 text-cyan-300" />
                          Destination
                        </span>
                        <span className="font-medium text-white">
                          {draft?.destination || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-slate-300">
                          <CalendarDays className="h-4 w-4 text-cyan-300" />
                          Travel Date
                        </span>
                        <span className="font-medium text-white">
                          {travelDate
                            ? format(travelDate, "dd MMM yyyy")
                            : "Not selected"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-slate-300">
                          <Users className="h-4 w-4 text-cyan-300" />
                          Travelers
                        </span>
                        <span className="font-medium text-white">
                          {numberOfPeople}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">Duration</span>
                        <span className="font-medium text-white">
                          {draft?.duration ? `${draft.duration} Days` : "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">Payment Method</span>
                        <span className="font-medium capitalize text-white">
                          {paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-6">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Base Price</span>
                        <span className="flex items-center gap-1 text-white">
                          <BadgeIndianRupee className="h-4 w-4 text-cyan-300" />
                          {draft?.packagePrice || 0}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                        <span>Travelers</span>
                        <span className="text-white">{numberOfPeople}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                        <span>Taxes & Fees</span>
                        <span className="flex items-center gap-1 text-white">
                          <BadgeIndianRupee className="h-4 w-4 text-cyan-300" />
                          {taxesAndFees}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
                        <span className="text-sm font-semibold text-slate-200">
                          Grand Total
                        </span>
                        <span className="flex items-center gap-1 text-2xl font-bold text-white">
                          <BadgeIndianRupee className="h-5 w-5 text-cyan-300" />
                          {finalTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-xs leading-6 text-slate-300">
                    By proceeding, you agree to your selected booking and
                    payment method. Online payments will continue via Razorpay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
