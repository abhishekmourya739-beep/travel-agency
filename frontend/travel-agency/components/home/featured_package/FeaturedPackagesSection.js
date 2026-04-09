import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import DestinationPackageCard from "@/components/destinations/cards/DestinationPackageCard";

export default function FeaturedPackagesSection({ packages = [] }) {
  if (!packages.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#f4f7fb] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_22%),radial-gradient(circle_at_left,rgba(15,23,42,0.05),transparent_18%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
              <Sparkles className="h-4 w-4" />
              Handpicked luxury journeys
            </div>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Featured Packages For Your Next Escape
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
              Explore our most loved premium travel packages, curated to deliver
              unforgettable moments, elegant stays, and seamless experiences.
            </p>
          </div>

          <Link
            href="/packages"
            className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
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
      </div>
    </section>
  );
}
