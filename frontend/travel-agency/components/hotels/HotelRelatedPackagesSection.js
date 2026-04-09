import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import DestinationPackageCard from "../destinations/cards/DestinationPackageCard";

export default function HotelRelatedPackagesSection({ packages = [], hotel }) {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
            Curated Journeys
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Related Packages
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Discover travel experiences connected to{" "}
            {hotel?.location?.name || "this destination"} and continue your
            journey with a complete package.
          </p>
        </div>

        <Link
          href={`/packages`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
        >
          Explore All Packages
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-slate-600">
          No related packages are available right now for this hotel.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {packages.slice(0, 4).map((pkg) => (
            <DestinationPackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}

      {packages.length > 3 ? (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/packages`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            View More Packages
          </Link>
        </div>
      ) : null}
    </section>
  );
}
