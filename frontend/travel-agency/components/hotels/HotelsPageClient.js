"use client";

import Link from "next/link";
import { Hotel, MapPin, Star } from "lucide-react";
import HotelsListingHeroSlider from "./HotelsListingHeroSlider";
import HotelFilterSidebar from "./HotelFilterSidebar";
import HotelPaginationBar from "./HotelPaginationBar";
import DestinationHotelCard from "@/components/destinations/cards/DestinationHotelCard";
import CtaBannerSection from "@/components/home/cta_banner/CtaSection";

export default function HotelsPageClient({
  hotels = [],
  pagination = {},
  filters = {},
  locations = [],
}) {
  const formatLabel = (value) =>
    value
      ?.split("-")
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(" ");

  const selectedLocationSlug = filters?.location || "";
  const totalHotels = pagination?.total || hotels.length;

  return (
    <section className="min-h-screen bg-[#f4f7fb]">
      <HotelsListingHeroSlider />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="self-start lg:sticky lg:top-24">
            <HotelFilterSidebar filters={filters} locations={locations} />
          </div>

          <div className="min-w-0">
            <div className="mb-8 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                    Search Results
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                    {hotels.length} Premium Hotel
                    {hotels.length !== 1 ? "s" : ""} Found
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedLocationSlug ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                        Destination: {formatLabel(selectedLocationSlug)}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                        All Destinations
                      </span>
                    )}

                    {filters.search ? (
                      <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700">
                        Search: {filters.search}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:min-w-65">
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Visible
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {hotels.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {totalHotels}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {hotels.length === 0 ? (
              <div className="rounded-4xl border border-slate-200 bg-white p-12 text-center shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50">
                  <Hotel className="h-9 w-9 text-cyan-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  No hotels found
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-slate-600">
                  We couldn&apos;t find any hotels for your current selection.
                  Try a different destination or budget range.
                </p>

                <Link
                  href="/hotels"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
                  {hotels.map((hotel, index) => (
                    <DestinationHotelCard
                      key={hotel._id}
                      hotel={hotel}
                      index={index}
                    />
                  ))}
                </div>

                <HotelPaginationBar pagination={pagination} filters={filters} />
              </>
            )}
          </div>
        </div>
      </div>

      <CtaBannerSection />
    </section>
  );
}
