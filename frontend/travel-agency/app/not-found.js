"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Home, Plane } from "lucide-react";

const slides = [
  "/hero1.jpg",
  "/hero4.jpg",
  "/package_hero1.webp",
  "/package_hero3.jpg",
];

export default function PageNotFound() {
  const [index, setIndex] = useState(0);

  // 🔥 Auto slider
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 🌄 BACKGROUND SLIDER */}
      <div className="absolute inset-0">
        {slides.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt="Travel background"
              fill
              priority={i === 0}
              className="object-cover scale-105 animate-[slowZoom_20s_linear_infinite]"
            />
          </div>
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/70" />

        {/* Glow gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.25),transparent_40%)]" />
      </div>

      {/* ✨ FLOATING ICON */}
      <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 animate-bounce">
        <Plane className="h-10 w-10 text-cyan-400 opacity-80" />
      </div>

      {/* 💎 MAIN CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl text-center">
          {/* GLASS CARD */}
          <div className="rounded-[36px] border border-white/20 bg-white/5 p-10 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              <Compass className="h-4 w-4 text-cyan-400" />
              Lost in Journey
            </div>

            {/* 404 */}
            <h1 className="mt-6 text-[90px] font-extrabold leading-none text-white sm:text-[120px]">
              404
            </h1>

            {/* Title */}
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              You’ve gone off the map 🌍
            </h2>

            {/* Description */}
            <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
              The destination you're looking for doesn’t exist or has been
              moved. But don’t worry — your next unforgettable journey is just a
              click away.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {/* Home */}
              <Link
                href="/"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:text-white"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </span>
                <span className="absolute inset-0 scale-0 rounded-full bg-cyan-500 transition-transform duration-300 group-hover:scale-100" />
              </Link>

              {/* Explore */}
              <Link
                href="/destinations"
                className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-slate-900"
              >
                Explore Destinations
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Hint */}
            <p className="mt-8 text-xs text-white/50">
              Try searching for destinations or head back to explore premium
              travel experiences.
            </p>
          </div>
        </div>
      </div>

      {/* ✨ CUSTOM ANIMATION */}
      <style jsx>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </main>
  );
}
