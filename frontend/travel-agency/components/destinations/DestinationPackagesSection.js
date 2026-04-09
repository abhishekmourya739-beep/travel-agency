import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import DestinationPackageCard from "./cards/DestinationPackageCard";
import { createSlug } from "@/lib/utils/slug";

export default function DestinationPackagesSection({
  location,
  packages = [],
}) {
  if (!packages.length) return null;

  return (
    <section className="mt-14">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
            <Sparkles className="h-4 w-4" />
            Curated experiences in {location?.name}
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-5xl">
            Packages In {location?.name}
          </h2>

          <p className="mt-4 text-base leading-8 text-slate-600">
            Explore handpicked package options built around this destination’s
            best stays, highlights, and premium travel experiences.
          </p>
        </div>

        <Link
          href={`/packages?location=${createSlug(location?.name || "")}`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          View All Packages
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg, index) => (
          <DestinationPackageCard key={pkg._id} pkg={pkg} index={index} />
        ))}
      </div>
    </section>
  );
}
