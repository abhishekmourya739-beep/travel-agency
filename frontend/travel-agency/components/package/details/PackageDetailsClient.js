"use client";

import {
  MapPin,
  Clock3,
  Hotel,
  Star,
  BadgeIndianRupee,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import PackageDetailsHeroSlider from "./PackageDetailsHeroSlider";
import { useState } from "react";
import BookNowButton from "./BookNowButton";
import WishlistButton from "@/components/global/WishlistButton";

export default function PackageDetailsClient({ pkg }) {
  const amenities = pkg?.hotel?.amenities || [];
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="min-h-screen bg-[#f4f7fb]">
      <div className="relative">
        <PackageDetailsHeroSlider pkg={pkg} />
      </div>

      <div className="relative z-10 py-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 items-start lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-700">
                  {pkg?.tripType || "Premium Trip"}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  {pkg?.duration} Days
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  {pkg?.location?.name}, {pkg?.location?.country}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                {pkg?.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                  <MapPin className="h-4 w-4 text-cyan-600" />
                  {pkg?.location?.name || "Destination"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                  <Clock3 className="h-4 w-4 text-cyan-600" />
                  {pkg?.duration} Days
                </span>

                {pkg?.hotel?.name ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                    <Hotel className="h-4 w-4 text-cyan-600" />
                    {pkg.hotel.name}
                  </span>
                ) : null}

                {pkg?.hotel?.rating ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                    <Star className="h-4 w-4 fill-cyan-500 text-cyan-500" />
                    {pkg.hotel.rating} Rating
                  </span>
                ) : null}
              </div>

              <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Package Overview
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {pkg?.description}
                </p>
              </div>

              <div className="mt-8 grid gap-8 xl:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">
                    Destination Details
                  </h3>

                  <div className="mt-5 space-y-4 text-slate-600">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Location
                      </p>
                      <p className="mt-2 text-base font-medium text-slate-900">
                        {pkg?.location?.name}, {pkg?.location?.country}
                      </p>
                    </div>

                    {pkg?.location?.description ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          About Destination
                        </p>
                        <p className="mt-2 text-base leading-7">
                          {pkg.location.description}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">
                    Stay Information
                  </h3>

                  {pkg?.hotel ? (
                    <div className="mt-5 space-y-4 text-slate-600">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Hotel Name
                        </p>
                        <p className="mt-2 text-base font-medium text-slate-900">
                          {pkg.hotel.name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Type
                          </p>
                          <p className="mt-2 text-base">
                            {pkg.hotel.hotelType || "Premium"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Rooms
                          </p>
                          <p className="mt-2 text-base">
                            {pkg.hotel.roomsAvailable ?? "Available"}
                          </p>
                        </div>
                      </div>

                      {pkg?.hotel?.description ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            About Stay
                          </p>
                          <p className="mt-2 text-base leading-7">
                            {pkg.hotel.description}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-4 text-slate-600">
                      Hotel details are not available for this package yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">
                  Premium Amenities
                </h3>

                {amenities.length > 0 ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {amenities.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-slate-600">
                    Amenities will be updated soon.
                  </p>
                )}
              </div>
              {pkg?.itinerary?.length > 0 && (
                <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">
                    Travel Itinerary
                  </h3>

                  <div className="mt-6 space-y-3">
                    {pkg.itinerary.map((day, i) => {
                      const isOpen = activeIndex === i;

                      return (
                        <div
                          key={i}
                          className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden transition"
                        >
                          {/* HEADER */}
                          <button
                            onClick={() => setActiveIndex(isOpen ? null : i)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left"
                          >
                            <div>
                              <p className="text-sm font-semibold text-cyan-600">
                                Day {day?.day || i + 1}
                              </p>
                              <p className="text-lg font-semibold text-slate-900">
                                {day?.title}
                              </p>
                            </div>

                            {/* ICON */}
                            <span className="ml-4">
                              {isOpen ? (
                                <Minus className="h-5 w-5 text-slate-700" />
                              ) : (
                                <Plus className="h-5 w-5 text-slate-700" />
                              )}
                            </span>
                          </button>

                          {/* CONTENT */}
                          <div
                            className={`grid transition-all duration-500 ease-in-out ${
                              isOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="px-5 pb-5 text-sm leading-7 text-slate-600">
                                {day?.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="self-start lg:sticky lg:top-24 h-fit">
            <div className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
                Booking Summary
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Reserve This Package
              </h2>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Starting From
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <BadgeIndianRupee className="h-6 w-6 text-cyan-600" />
                  <p className="text-4xl font-bold text-slate-900">
                    {pkg?.price}
                  </p>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Per package · Taxes may apply based on checkout details
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-500">Destination</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {pkg?.location?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-500">Duration</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {pkg?.duration} Days
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-500">Trip Type</span>
                  <span className="text-sm font-semibold capitalize text-slate-900">
                    {pkg?.tripType || "Premium"}
                  </span>
                </div>

                {pkg?.hotel?.name ? (
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                    <span className="text-sm text-slate-500">Hotel</span>
                    <span className="text-right text-sm font-semibold text-slate-900">
                      {pkg.hotel.name}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="mt-8  flex gap-6 items-center">
                <BookNowButton pkg={pkg} />

                <div className="flex items-center ">
                  <WishlistButton
                    item={pkg}
                    borderColor="border-black/20"
                    textColor="text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
