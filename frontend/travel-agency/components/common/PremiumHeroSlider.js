"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumHeroSlider({
  slides = [],
  heightClass = "h-[560px]",
  overlay = true,
  children,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl ${heightClass}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide?.image}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={activeSlide?.image || "/hero2.jpg"}
            alt={activeSlide?.title || "Travel"}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {overlay && (
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/20" />
      )}

      <div className="absolute inset-0">{children}</div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-6 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-10 bg-amber-300"
                  : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
