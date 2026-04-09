"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { getOptimizedImageUrl } from "@/lib/utils/image";
import Slider from "@/components/global/Slider";
import Link from "next/link";

export default function PackageDetailsHeroSlider({ pkg }) {
  const router = useRouter();

  const slides = useMemo(() => {
    // ✅ FIXED: always use .url
    const locationImage = pkg?.location?.image?.url;

    const hotelImages = (pkg?.hotel?.images || [])
      .slice(0, 4)
      .map((img) => img?.url)
      .filter(Boolean);

    const candidates = [locationImage, ...hotelImages].filter(Boolean);

    return candidates.map((img, index) => ({
      id: index + 1,
      image: getOptimizedImageUrl(img, 1600, 1100),

      titleLight: "DISCOVER",
      titleBottom: pkg?.location?.name || "DESTINATION",
    }));
  }, [pkg]);

  return (
    <Slider heroSlides={slides}>
      {/* ✅ BUTTON ONLY HERE */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/packages"
          className="group relative overflow-hidden rounded-full border border-white/20 bg-white/10 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all duration-500 hover:bg-white hover:text-black"
        >
          <span className="relative z-10">Back to Packages</span>

          <span className="absolute inset-0 scale-0 rounded-full bg-white transition-transform duration-500 group-hover:scale-100" />
        </Link>
      </div>
    </Slider>
  );
}
