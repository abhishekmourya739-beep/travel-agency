"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, BadgeIndianRupee, ArrowRight, MapPin } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils/image";
import WishlistButton from "@/components/global/WishlistButton";

export default function DestinationPackageCard({ pkg, index = 0 }) {
  return (
    <article className="group overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_90px_rgba(15,23,42,0.15)]">
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden bg-slate-200">
        <Image
          src={
            getOptimizedImageUrl(pkg?.thumbnail?.url, 900, 700) || "/hero2.jpg"
          }
          alt={pkg?.title || "Travel package"}
          fill
          priority={index < 4}
          quality={75}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-900/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {pkg?.location?.name || "Destination"}
          </span>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
              {pkg?.duration} Days
            </span>

            {/* ❤️ Wishlist */}
            <WishlistButton item={pkg} />
          </div>
        </div>

        {/* Bottom Title */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm font-medium text-white/75">
            Curated Holiday Experience
          </p>
          <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-tight">
            {pkg?.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-cyan-600" />
            {pkg?.location?.name || "Unknown"}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4 text-cyan-600" />
            {pkg?.duration} Days
          </span>
        </div>

        {/* Description */}
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
          {pkg?.description}
        </p>

        {/* Price Box */}
        <div className="mt-6 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Starting From
              </p>

              <div className="mt-2 flex items-center gap-2">
                <BadgeIndianRupee className="h-5 w-5 text-cyan-600" />
                <p className="text-3xl font-bold text-slate-900">
                  {pkg?.price}
                </p>
              </div>
            </div>

            <Link
              href={`/packages/${pkg._id}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
