import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

export default function ContactCTA() {
  return (
    <GlassCard className="px-6 py-10 md:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-amber-200">
            Ready to Explore
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white md:text-5xl">
            Browse curated packages built for premium travel experiences.
          </h2>
        </div>

        <Link
          href="/packages"
          className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-linear-to-r from-amber-300 via-yellow-200 to-orange-300 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Explore Packages
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
}
