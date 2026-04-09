"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ContactHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
        <Sparkles className="h-4 w-4" />
        Contact Us
      </div>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-6xl">
        Let’s plan your next
        <span className="bg-linear-to-r from-amber-200 via-yellow-100 to-orange-200 bg-clip-text text-transparent">
          {" "}
          premium journey
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
        Reach out for custom travel planning, booking assistance, premium
        destination suggestions, or any question about your next escape.
      </p>
    </motion.div>
  );
}
