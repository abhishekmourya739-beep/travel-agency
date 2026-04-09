"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Slider({ heroSlides = [], children }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[activeIndex];

  if (!heroSlides.length) return null;

  return (
    <section className="relative h-screen min-h-175 w-full ">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1800 ease-in-out will-change-opacity ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.titleBold || "Hero Slide"}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Optional top border line like premium hero */}
      <div className="absolute left-1/2 top-0 z-20 w-[90%] max-w-7xl -translate-x-1/2 border-b border-white/20" />

      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center text-white">
          {/* Animated slide content */}
          <div
            key={activeSlide.id}
            className="mt-24 max-w-6xl animate-heroContent"
          >
            <p className="mb-6 text-xs font-medium tracking-[0.5em] text-white/90 sm:text-sm">
              {activeSlide.subtitle}
            </p>

            <h1 className="text-5xl font-light uppercase leading-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="mr-3 inline-block text-transparent [-webkit-text-stroke:1.5px_white]">
                {activeSlide.titleLight}
              </span>
              <span className="font-extrabold text-white">
                {activeSlide.titleBold}
              </span>
            </h1>

            <h2 className="mt-2 text-4xl font-extrabold uppercase leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {activeSlide.titleBottom}
            </h2>
          </div>

          {/* Keep children exactly here */}
          {children}
        </div>
      </div>

      {/* Dots */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id ?? index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-10 bg-white" : "w-2.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
