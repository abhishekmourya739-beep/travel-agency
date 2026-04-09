"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import PremiumHeroSlider from "@/components/common/PremiumHeroSlider";

const slides = [
  {
    image: "/hero2.jpg",
    title: "Luxury Travel",
  },
  {
    image: "/hero3.jpg",
    title: "Premium Destinations",
  },
  {
    image: "/hero4.jpg",
    title: "Elegant Escapes",
  },
];

export default function AboutHero() {
  return (
    <PremiumHeroSlider slides={slides}>
      <div className="flex h-full items-center px-6 py-10 md:px-10 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
            <Sparkles className="h-4 w-4" />
            About Our Brand
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
            We create journeys that feel
            <span className="bg-linear-to-r from-amber-200 via-yellow-100 to-orange-200 bg-clip-text text-transparent">
              {" "}
              refined, memorable, and effortless
            </span>
            .
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            Our travel platform is designed for modern explorers who want
            premium destinations, curated stays, seamless booking, and a truly
            elevated travel experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
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
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </PremiumHeroSlider>
  );
}
