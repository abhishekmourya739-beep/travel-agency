import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getAllLocations } from "@/lib/api/location";
import PremiumDestinationCard from "@/components/destinations/cards/PremiumDestinationCard";

export default async function Destinations() {
  const locations = await getAllLocations();
  const visibleLocations = locations.slice(0, 9);

  return (
    <section className="relative overflow-hidden bg-[#f4f7fb] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.05),transparent_18%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
              <Sparkles className="h-4 w-4" />
              Explore iconic destinations
            </div>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Discover Places Designed For Extraordinary Journeys
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
              Browse handpicked destinations with premium stays, curated
              packages, and unforgettable travel experiences.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            View All Destinations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {visibleLocations.map((destination, index) => (
            <PremiumDestinationCard
              key={destination._id}
              destination={destination}
              large={index === 0 || index === 4}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
