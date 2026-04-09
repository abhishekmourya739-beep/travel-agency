import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0">
        <Image
          src="/hero2.jpg"
          alt="Luxury travel CTA"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_24%),radial-gradient(circle_at_left,rgba(255,255,255,0.08),transparent_20%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="rounded-[36px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl md:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Luxury journeys begin here
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Ready To Plan Your Next Unforgettable Escape?
            </h2>

            <p className="mt-5 text-base leading-8 text-white/75 md:text-lg">
              Explore curated destinations, premium stays, and handpicked travel
              experiences designed to make every journey feel extraordinary.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
              >
                Explore Packages
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Start With Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
