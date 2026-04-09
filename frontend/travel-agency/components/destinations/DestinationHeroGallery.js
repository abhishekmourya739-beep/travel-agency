"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils/image";

export default function DestinationHeroGallery({
  location,
  packages = [],
  hotels = [],
}) {
  const images = useMemo(() => {
    const candidates = [
      location?.image?.url,
      ...packages.map((pkg) => pkg?.thumbnail?.url),
      ...hotels.map((hotel) => hotel?.thumbnail?.url),
      ...hotels.flatMap((hotel) =>
        (hotel?.images || []).map((img) => img?.url),
      ),
    ].filter(Boolean);

    return [...new Set(candidates)];
  }, [location, packages, hotels]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex] || "/hero1.jpg";
  useEffect(() => {
    if (images.length <= 1) return;

    let interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  return (
    <section className="relative overflow-hidden ">
      <div className="relative h-screen min-h-175 w-full">
        <Image
          src={getOptimizedImageUrl(activeImage, 1600, 1100) || "/hero1.jpg"}
          alt={location?.name || "Destination"}
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        {/* Optional top border line like premium hero */}
        <div className="absolute left-1/2 top-0 z-20 w-[90%] max-w-7xl -translate-x-1/2 border-b border-white/20" />

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Premium destination spotlight
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-6xl">
              Discover {location?.name}
            </h1>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
              <MapPin className="h-4 w-4 text-cyan-300" />
              {location?.country}
            </div>
          </div>

          {images.length > 1 ? (
            <div className="mt-8 flex gap-3 overflow-x-auto pb-1">
              {images.slice(0, 10).map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                    index === activeIndex
                      ? "border-cyan-400"
                      : "border-white/20"
                  }`}
                >
                  <Image
                    src={getOptimizedImageUrl(img, 300, 200) || "/hero1.jpg"}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
