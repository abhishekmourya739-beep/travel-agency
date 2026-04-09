"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Hotel,
  BadgeIndianRupee,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils/image";
import WishlistButton from "@/components/global/WishlistButton";

export default function DestinationHotelCard({ hotel, index = 0 }) {
  const images = useMemo(() => {
    const candidates = [
      hotel?.thumbnail?.url,
      ...(hotel?.images || []).map((img) => img?.url),
      hotel?.location?.image?.url,
    ].filter(Boolean);

    return [...new Set(candidates)];
  }, [hotel]);

  const amenities = useMemo(() => {
    return (hotel?.amenities || []).slice(0, 3);
  }, [hotel]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage =
    getOptimizedImageUrl(images[activeIndex], 1100, 850) || "/hero3.jpg";

  useEffect(() => {
    if (!images.length) return;

    images.forEach((img) => {
      const preloadImg = new window.Image();
      preloadImg.src = getOptimizedImageUrl(img, 1100, 850) || "/hero3.jpg";
    });
  }, [images]);

  const goPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbClick = (e, thumbIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(thumbIndex);
  };

  return (
    <article className="group overflow-hidden rounded-[34px] border border-white/70 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
      <div className="relative overflow-hidden">
        <div className="relative h-80 overflow-hidden bg-slate-200">
          <Image
            src={activeImage}
            alt={hotel?.name || "Hotel"}
            fill
            priority={index < 2}
            quality={78}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />

          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.16)_30%,rgba(2,6,23,0.8)_100%)]" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%)]" />

          <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Luxury Stay
            </span>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2">
              {/* ⭐ Rating */}
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-2 text-sm font-semibold text-white backdrop-blur-xl">
                <Star className="h-4 w-4 fill-cyan-300 text-cyan-300" />
                {hotel?.rating || 0}
              </div>

              {/* ❤️ Wishlist */}
              <WishlistButton item={hotel} />
            </div>
          </div>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white opacity-100 backdrop-blur-xl transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 hover:bg-white hover:text-slate-900"
                aria-label="Previous hotel image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white opacity-100 backdrop-blur-xl transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 hover:bg-white hover:text-slate-900"
                aria-label="Next hotel image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}

          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
                <Hotel className="h-3.5 w-3.5 text-cyan-300" />
                {hotel?.hotelType || "Premium Stay"}
              </span>

              {hotel?.location?.name ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5 text-cyan-300" />
                  {hotel.location.name}
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 line-clamp-2 text-[26px] font-bold leading-tight">
              {hotel?.name}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">
              {hotel?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[26px] bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Price Per Night
            </p>

            <div className="mt-3 flex items-end gap-2">
              <BadgeIndianRupee className="mb-1 h-5 w-5 text-cyan-600" />
              <p className="text-3xl font-bold leading-none text-slate-900">
                {hotel?.pricePerNight || 0}
              </p>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Elegant comfort with premium hospitality
            </p>
          </div>

          <div className="rounded-[26px] bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Availability
            </p>

            <div className="mt-3 flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-cyan-600" />
              <p className="text-2xl font-bold text-slate-900">
                {hotel?.roomsAvailable ?? 0}
              </p>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Rooms ready for your next escape
            </p>
          </div>
        </div>

        {amenities.length > 0 ? (
          <div className="mt-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Selected Amenities
            </p>

            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, idx) => (
                <span
                  key={`${amenity}-${idx}`}
                  className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700"
                >
                  {amenity}
                </span>
              ))}

              {(hotel?.amenities?.length || 0) > 3 ? (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                  +{hotel.amenities.length - 3} more
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="mt-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.slice(0, 5).map((img, thumbIndex) => (
                <button
                  key={`${img}-${thumbIndex}`}
                  type="button"
                  onClick={(e) => handleThumbClick(e, thumbIndex)}
                  className={`relative h-16 w-22 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                    thumbIndex === activeIndex
                      ? "border-cyan-400 shadow-[0_8px_20px_rgba(34,211,238,0.18)]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Image
                    src={getOptimizedImageUrl(img, 180, 130) || "/hero3.jpg"}
                    alt={`Hotel preview ${thumbIndex + 1}`}
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="sm:max-w-[50%]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Perfect For
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
              Premium leisure stays & curated getaways
            </p>
          </div>

          <Link
            href={`/hotels/${hotel?._id}`}
            className="group/btn inline-flex items-center justify-center gap-2 self-start rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-cyan-600 sm:self-auto"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
