"use client";

import HotelDetailsHero from "./HotelDetailsHero";
import HotelOverviewSection from "./HotelOverviewSection";
import HotelAmenitiesSection from "./HotelAmenitiesSection";
import HotelHighlightsSection from "./HotelHighlightsSection";
import HotelRelatedPackagesSection from "./HotelRelatedPackagesSection";
import HotelStickyInfoCard from "./HotelStickyInfoCard";
import CtaBannerSection from "@/components/home/cta_banner/CtaSection";

export default function HotelDetailsPageClient({
  hotel,
  relatedPackages = [],
}) {
  return (
    <section className="min-h-screen bg-[#f4f7fb]">
      <HotelDetailsHero hotel={hotel} />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-8">
            <HotelOverviewSection hotel={hotel} />
            <HotelAmenitiesSection hotel={hotel} />
            <HotelHighlightsSection hotel={hotel} />
            <HotelRelatedPackagesSection
              packages={relatedPackages}
              hotel={hotel}
            />
          </div>

          <div className="self-start lg:sticky lg:top-24">
            <HotelStickyInfoCard hotel={hotel} />
          </div>
        </div>
      </div>

      <CtaBannerSection />
    </section>
  );
}
