"use client";

import Link from "next/link";
import {
  BadgeIndianRupee,
  Star,
  MapPin,
  BedDouble,
  ArrowRight,
} from "lucide-react";
import { createSlug } from "@/lib/utils/slug";
import WishlistButton from "../global/WishlistButton";

export default function HotelStickyInfoCard({ hotel }) {
  const locationSlug = createSlug(hotel?.location?.name || "");

  return (
    <aside className="overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="bg-[linear-gradient(135deg,rgba(6,182,212,0.12),rgba(15,23,42,0.04))] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
          Quick Info
        </p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          Plan Your Stay
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Explore packages, destination experiences, and premium travel options
          connected to this hotel.
        </p>
      </div>

      <div className="space-y-4 p-6">
        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <BadgeIndianRupee className="h-5 w-5 text-cyan-600" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Price Per Night
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ₹{hotel?.pricePerNight || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <Star className="h-4 w-4 fill-cyan-500 text-cyan-500" />
            <span className="text-sm font-medium text-slate-700">
              {hotel?.rating || 0} Guest Rating
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <MapPin className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-medium text-slate-700">
              {hotel?.location?.name || "Destination"}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <BedDouble className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-medium text-slate-700">
              {hotel?.roomsAvailable ?? 0} Rooms Available
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <Link
              href={
                locationSlug ? `/destinations/${locationSlug}` : "/destinations"
              }
              className="flex-1 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Explore Destination
            </Link>

            <WishlistButton
              item={hotel}
              borderColor="border-black/20"
              textColor="text-black"
            />
          </div>

          <Link
            href={
              locationSlug ? `/packages?location=${locationSlug}` : "/packages"
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View Related Packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
