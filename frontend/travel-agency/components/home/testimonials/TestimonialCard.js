"use client";

import Image from "next/image";
import { Quote, Star, MapPin } from "lucide-react";

export default function TestimonialCard({ item, isActive }) {
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-4xl border border-white/60 bg-white/80  backdrop-blur-xl transition-all duration-700 ${
        isActive ? "scale-100 opacity-100 " : "scale-[0.99] opacity-95"
      }`}
    >
      {/* subtle inside glow ONLY (not outside) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-60 w-60 bg-cyan-200/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 bg-blue-200/20 blur-3xl" />
      </div>

      <div className="relative grid min-h-90 w-full items-center gap-6 p-6 md:min-h-95 lg:grid-cols-[1.3fr_0.7fr] lg:gap-8 lg:p-8 xl:min-h-97.5">
        {/* LEFT */}
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-cyan-700 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Travel Testimonial
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Quote className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mb-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < item.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>

            <h3 className="text-[2rem] font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-[2.3rem] lg:text-[2.7rem]">
              {item.title}
            </h3>

            <p className="mt-4 text-[15px] leading-7 text-slate-600">
              {item.review}
            </p>

            {item.reviewSecond && (
              <p className="mt-3 text-[15px] leading-7 text-slate-600">
                {item.reviewSecond}
              </p>
            )}
          </div>

          {/* USER */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white shadow-md">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {item.name}
                </h4>
                <p className="text-sm text-slate-500">{item.role}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-cyan-600" />
                {item.destination}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-[320px]">
            <div className="relative aspect-4/3 overflow-hidden rounded-[26px] border border-white/50 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 380px"
                className="object-cover transition duration-700 group-hover:scale-[1.05]"
              />
            </div>

            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 text-xs font-semibold shadow-md backdrop-blur-md">
              Verified Guest
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
