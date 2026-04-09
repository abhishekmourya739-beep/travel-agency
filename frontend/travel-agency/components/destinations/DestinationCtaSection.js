import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { createSlug } from "@/lib/utils/slug";
import { getOptimizedImageUrl } from "@/lib/utils/image";

export default function DestinationCtaSection({ location }) {
  return (
    <section
      className="relative mt-16 overflow-hidden bg-fixed bg-center bg-cover py-16"
      style={{
        backgroundImage: `url(${getOptimizedImageUrl(location?.image?.url, 1600, 900) || "/hero2.jpg"})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute left-1/2 top-0 z-20 w-[90%] max-w-7xl -translate-x-1/2 border-b border-white/20" />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          Start planning your next premium journey
        </div>

        <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
          Ready To Explore More Of {location?.name}?
        </h2>

        <p className="mt-5 text-base leading-8 text-white/75 md:text-lg">
          Discover more curated travel packages and premium stay options
          tailored for this destination.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={`/packages?location=${createSlug(location?.name || "")}`}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            Explore Packages
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Browse All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
