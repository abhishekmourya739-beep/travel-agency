import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

export default function AboutCTA() {
  return (
    <GlassCard className="px-6 py-10 md:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-amber-200">
            Start Your Journey
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white md:text-5xl">
            Discover destinations designed for unforgettable travel moments.
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-linear-to-r from-amber-300 via-yellow-200 to-orange-300 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Explore Packages
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white/85 transition hover:bg-white/10"
          >
            Talk to Us
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
