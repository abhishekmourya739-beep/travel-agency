import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { createSlug } from "@/lib/utils/slug";
import { getOptimizedImageUrl } from "@/lib/utils/image";

export default function PremiumDestinationCard({
  destination,
  large = false,
  priority = false,
}) {
  const href = `/destinations/${createSlug(destination?.name || "")}`;

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_90px_rgba(15,23,42,0.15)] ${
        large ? "min-h-105" : "min-h-85"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={
            getOptimizedImageUrl(destination?.image?.url, 1000, 900) ||
            "/hero1.jpg"
          }
          alt={destination?.name || "Destination"}
          fill
          priority={priority}
          quality={75}
          sizes={
            large
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-0 h-0.5 w-0 -translate-x-1/2 rounded-full bg-cyan-400 transition-all duration-500 group-hover:w-1/2" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_24%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-7">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition duration-300 group-hover:bg-white/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/75">
                {destination?.country || "Premium Destination"}
              </p>
              <h3 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
                {destination?.name}
              </h3>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition duration-300 group-hover:rotate-12 group-hover:bg-cyan-500">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white/80">
            <MapPin className="h-4 w-4 text-cyan-300" />
            Explore destination
          </div>
        </div>
      </div>
    </Link>
  );
}
