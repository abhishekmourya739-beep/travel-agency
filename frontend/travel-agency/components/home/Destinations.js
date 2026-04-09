import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import getAllLocations from "@/lib/api/location";
import Image from "next/image";
import { createSlug } from "@/lib/utils/slug";

export default async function Destinations({ locations = [] }) {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 flex flex-col items-center justify-between gap-6 text-center lg:mb-16 lg:flex-row lg:text-left">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-cyan-50 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Top Destinations
            </span>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Explore the most
              <span className="ml-3 text-cyan-500">beautiful places</span>
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              Discover handpicked destinations with breathtaking views,
              unforgettable experiences, and perfectly planned travel moments.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-cyan-500 hover:text-cyan-500"
          >
            View All Destinations
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.slice(0, 9).map((loc) => (
            <Link
              key={loc._id}
              href={`/destinations/${createSlug(loc?.name || "")}`}
              className="group relative block overflow-hidden rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              {/* Image */}
              <div className="relative h-105 overflow-hidden">
                <Image
                  src={loc.image?.url}
                  alt={loc.name}
                  fill
                  unoptimized
                  className="object-cover rounded-xl"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

                {/* Default Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 px-6 pb-6 z-10 transition-all duration-500 group-hover:-translate-y-24 transform-gpu">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    <p className="text-sm text-white/90">{loc.country}</p>
                  </div>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {loc.name}
                  </h3>

                  <div className="mt-3 h-0.5 w-20 bg-cyan-400 transition-all duration-500 group-hover:w-[92%]" />
                </div>

                {/* Hover Content (separate layer) */}
                <div className="absolute inset-x-0 bottom-6 px-6 opacity-0 translate-y-6 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                  <p className="text-sm text-white/80">
                    {loc.description?.slice(0, 90) ||
                      "Discover this amazing destination."}
                    ...
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    Explore Destination
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
