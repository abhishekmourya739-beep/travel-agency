"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Hotel,
  ArrowLeft,
} from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils/image";

export default function HotelDetailsHero({ hotel }) {
  const images = useMemo(() => {
    const candidates = [
      hotel?.thumbnail?.url,
      ...(hotel?.images || []).map((img) => img?.url),
      hotel?.location?.image?.url,
    ].filter(Boolean);

    return [...new Set(candidates)];
  }, [hotel]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex] || "/hero3.jpg";

  const goPrev = () => {
    setActiveIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[92vh] min-h-180 w-full">
        <Image
          src={getOptimizedImageUrl(activeImage, 1800, 1200) || "/hero3.jpg"}
          alt={hotel?.name || "Hotel"}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.28)_0%,rgba(2,6,23,0.38)_30%,rgba(2,6,23,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%)]" />

        <div className="absolute left-0 right-0 top-0 z-20">
          <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6 lg:px-8">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Hotels
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="mx-auto max-w-7xl px-4 pb-10 md:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                  <Hotel className="h-4 w-4 text-cyan-300" />
                  {hotel?.hotelType || "Luxury Stay"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                  <Star className="h-4 w-4 fill-cyan-300 text-cyan-300" />
                  {hotel?.rating || 0} Rating
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  {hotel?.location?.name || "Destination"}
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">
                Refined Hospitality Experience
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
                {hotel?.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                {hotel?.description}
              </p>
            </div>

            {images.length > 1 ? (
              <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.slice(0, 6).map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      onClick={() => setActiveIndex(index)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                        index === activeIndex
                          ? "border-cyan-300 shadow-[0_0_0_4px_rgba(255,255,255,0.12)]"
                          : "border-white/15"
                      }`}
                    >
                      <Image
                        src={
                          getOptimizedImageUrl(img, 240, 160) || "/hero3.jpg"
                        }
                        alt={`Hotel image ${index + 1}`}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={goPrev}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-slate-900"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={goNext}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-slate-900"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
