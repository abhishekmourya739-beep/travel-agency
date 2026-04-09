"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { createSlug } from "@/lib/utils/slug";
import FilterSelect from "./FilterSelect";

export default function PackageFilterSidebar({ filters = {}, locations = [] }) {
  const router = useRouter();

  const locationOptions = useMemo(
    () => [
      { label: "All Destinations", value: "" },
      ...locations.map((loc) => ({
        label: loc.name,
        value: createSlug(loc.name),
      })),
    ],
    [locations],
  );

  const tripTypeOptions = [
    { label: "All Trip Types", value: "" },
    { label: "Adventure", value: "adventure" },
    { label: "Relaxation", value: "relaxation" },
    { label: "Cultural", value: "cultural" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "" },
    { label: "Price: Low to High", value: "ltoh" },
    { label: "Price: High to Low", value: "htol" },
    { label: "Short Duration", value: "shortDuration" },
    { label: "Long Duration", value: "longDuration" },
    { label: "Oldest First", value: "old" },
  ];

  const [search, setSearch] = useState(filters.search || "");
  const [minPrice, setMinPrice] = useState(filters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");
  const [location, setLocation] = useState(
    locationOptions.find((o) => o.value === (filters.location || "")) ||
      locationOptions[0],
  );
  const [tripType, setTripType] = useState(
    tripTypeOptions.find((o) => o.value === (filters.tripType || "")) ||
      tripTypeOptions[0],
  );
  const [sort, setSort] = useState(
    sortOptions.find((o) => o.value === (filters.sort || "")) || sortOptions[0],
  );

  useEffect(() => {
    setSearch(filters.search || "");
    setMinPrice(filters.minPrice || "");
    setMaxPrice(filters.maxPrice || "");
    setLocation(
      locationOptions.find((o) => o.value === (filters.location || "")) ||
        locationOptions[0],
    );
    setTripType(
      tripTypeOptions.find((o) => o.value === (filters.tripType || "")) ||
        tripTypeOptions[0],
    );
    setSort(
      sortOptions.find((o) => o.value === (filters.sort || "")) ||
        sortOptions[0],
    );
  }, [filters, locationOptions]);

  const applyFilters = () => {
    const query = new URLSearchParams();

    if (search.trim()) query.set("search", search.trim());
    if (location.value) query.set("location", location.value);
    if (tripType.value) query.set("tripType", tripType.value);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);
    if (sort.value) query.set("sort", sort.value);
    if (filters.package) query.set("package", filters.package);

    query.set("page", "1");

    router.push(`/packages?${query.toString()}`);
  };

  const clearFilters = () => {
    router.push("/packages");
  };

  return (
    <aside className="overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(6,182,212,0.08),rgba(15,23,42,0.02))] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <SlidersHorizontal className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
              Refine Results
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Smart Filters
            </h2>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
          <Sparkles className="h-4 w-4 text-cyan-600" />
          Discover Your Perfect Trip
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Search
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packages"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Destination
          </label>
          <FilterSelect
            value={location}
            onChange={setLocation}
            options={locationOptions}
            placeholder="Choose destination"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Trip Type
          </label>
          <FilterSelect
            value={tripType}
            onChange={setTripType}
            options={tripTypeOptions}
            placeholder="Choose trip type"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Sort By
          </label>
          <FilterSelect
            value={sort}
            onChange={setSort}
            options={sortOptions}
            placeholder="Choose sort"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            <IndianRupee className="h-3.5 w-3.5" />
            Budget Range
          </label>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min ₹"
              className="h-14 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 shadow-sm"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max ₹"
              className="h-14 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3 pt-2">
          <button
            onClick={applyFilters}
            className="h-14 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            Apply Filters
          </button>

          <button
            onClick={clearFilters}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Clear filters"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
