import {
  BedDouble,
  BadgeIndianRupee,
  MapPin,
  Building2,
  Star,
} from "lucide-react";

export default function HotelOverviewSection({ hotel }) {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
        Hotel Overview
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <BadgeIndianRupee className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Per Night
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            ₹{hotel?.pricePerNight || 0}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <Star className="h-5 w-5 fill-cyan-500 text-cyan-500" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Guest Rating
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {hotel?.rating || 0}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <BedDouble className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Rooms Available
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {hotel?.roomsAvailable ?? 0}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <MapPin className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Destination
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {hotel?.location?.name || "Location"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hotel?.location?.country || "Premium destination"}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] bg-[linear-gradient(135deg,rgba(6,182,212,0.08),rgba(15,23,42,0.03))] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              A stay crafted for comfort and style
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {hotel?.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
