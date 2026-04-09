"use client";

import DestinationHeroGallery from "./DestinationHeroGallery";
import DestinationOverview from "./DestinationOverview";
import DestinationStatsStrip from "./DestinationStatsStrip";
import DestinationPackagesSection from "./DestinationPackagesSection";
import DestinationHotelsSection from "./DestinationHotelsSection";
import DestinationCtaSection from "./DestinationCtaSection";

export default function DestinationPageClient({
  location,
  packages = [],
  hotels = [],
}) {
  return (
    <section className="min-h-screen bg-[#f4f7fb]">
      <div>
        <DestinationHeroGallery
          location={location}
          packages={packages}
          hotels={hotels}
        />

        <div className="m-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <DestinationOverview location={location} />
          <DestinationStatsStrip
            packageCount={packages.length}
            hotelCount={hotels.length}
          />
        </div>
        <div className="m-10">
          <DestinationPackagesSection location={location} packages={packages} />
          <DestinationHotelsSection location={location} hotels={hotels} />
        </div>
        <DestinationCtaSection location={location} />
      </div>
    </section>
  );
}
