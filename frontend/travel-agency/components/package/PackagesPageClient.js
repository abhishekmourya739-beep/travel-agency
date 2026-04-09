"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock3,
  ArrowRight,
  BadgeIndianRupee,
  PackageOpen,
} from "lucide-react";
import PackageFilterSidebar from "./packageFilterSidebar";
import PaginationBar from "./PaginationBar";
import PackageListingHeroSlider from "./PackageListingHeroSlider";
import { getOptimizedImageUrl } from "@/lib/utils/image";
import DestinationPackageCard from "../destinations/cards/DestinationPackageCard";
import CtaBannerSection from "../home/cta_banner/CtaSection";

export default function PackagesPageClient({
  packages = [],
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
  const selectedPackageSlug = filters?.package || "";
  const totalPackages = pagination?.total || packages.length;

  return (
    <section className="min-h-screen bg-[#f4f7fb]">
      <PackageListingHeroSlider />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="self-start lg:sticky lg:top-24">
            <PackageFilterSidebar filters={filters} locations={locations} />
          </div>

          <div className="min-w-0">
            <div className="mb-8 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                    Search Results
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                    {packages.length} Premium Package
                    {packages.length !== 1 ? "s" : ""} Found
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

                    {selectedPackageSlug ? (
                      <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700">
                        Package: {formatLabel(selectedPackageSlug)}
                      </span>
                    ) : null}

                    {filters.tripType ? (
                      <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700">
                        Type: {formatLabel(filters.tripType)}
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
                      {packages.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {totalPackages}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {packages.length === 0 ? (
              <div className="rounded-4xl border border-slate-200 bg-white p-12 text-center shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50">
                  <PackageOpen className="h-9 w-9 text-cyan-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  No packages found
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-slate-600">
                  We couldn&apos;t find any packages for your current selection.
                  Try a different destination, trip type, or budget range.
                </p>

                <Link
                  href="/packages"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
                  {packages.map((pkg, index) => (
                    <DestinationPackageCard
                      key={pkg._id}
                      pkg={pkg}
                      index={index}
                    />
                  ))}
                </div>

                <PaginationBar pagination={pagination} filters={filters} />
              </>
            )}
          </div>
        </div>
      </div>
      <CtaBannerSection />
    </section>
  );
}
