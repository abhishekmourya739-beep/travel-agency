"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import PremiumDestinationCard from "./cards/PremiumDestinationCard";
import Slider from "../global/Slider";

const slides = [
  {
    id: 1,
    image: "/package_hero1.webp",
    subtitle: "LET'S TRAVEL THE WORLD WITH US",
    titleLight: "DISCOVER",
    titleBold: "PREMIUM",
    titleBottom: "TRAVEL EXPERIENCES",
  },
  {
    id: 2,
    image: "/hero4.jpg",
    subtitle: "FIND AMAZING PLACES TO EXPLORE",
    titleLight: "EXPLORE",
    titleBold: "BEAUTIFUL",
    titleBottom: "DESTINATIONS",
  },
  {
    id: 3,
    image: "/package_hero3.jpg",
    subtitle: "MAKE YOUR JOURNEY UNFORGETTABLE",
    titleLight: "ENJOY",
    titleBold: "LUXURY",
    titleBottom: "HOLIDAYS",
  },
];
export default function DestinationsMainPageClient({ locations = [] }) {
  const [search, setSearch] = useState("");

  const filteredLocations = useMemo(() => {
    if (!search.trim()) return locations;

    const q = search.toLowerCase();

    return locations.filter(
      (item) =>
        item?.name?.toLowerCase().includes(q) ||
        item?.country?.toLowerCase().includes(q) ||
        item?.description?.toLowerCase().includes(q),
    );
  }, [locations, search]);

  return (
    <section className="min-h-screen bg-[#f4f7fb]">
      <Slider heroSlides={slides}>
        <div className="mt-10 w-full max-w-2xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Curated global destinations
          </div>

          {/* Search */}
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 backdrop-blur-md shadow-lg">
            <Search className="h-4 w-4 text-cyan-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations, countries, or experiences"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
            />
          </div>

          {/* CTA */}
          <div className="mt-6 flex gap-4 justify-center mb-5">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 hover:text-white">
              Explore Packages
            </button>

            <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              View Destinations
            </button>
          </div>
        </div>
      </Slider>
      <div className="mx-auto max-w-7xl px-4  md:px-6 lg:px-8">
        <div className="mt-10 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                Destinations
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                {filteredLocations.length} Destination
                {filteredLocations.length !== 1 ? "s" : ""} Available
              </h2>
            </div>

            <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
              Total destinations:{" "}
              <span className="font-semibold text-slate-900">
                {locations.length}
              </span>
            </div>
          </div>
        </div>

        <div className="py-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredLocations.map((destination, index) => (
            <PremiumDestinationCard
              key={destination._id}
              destination={destination}
              large={index % 5 === 0}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
