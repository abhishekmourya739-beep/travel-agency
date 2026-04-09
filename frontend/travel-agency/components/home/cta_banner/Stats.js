"use client";

import { useEffect, useRef, useState } from "react";
import { Globe2, MapPinned, BriefcaseBusiness, Users } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Globe2,
    value: 20,
    suffix: "+",
    label: "Global Destinations",
  },
  {
    id: 2,
    icon: BriefcaseBusiness,
    value: 100,
    suffix: "+",
    label: "Curated Packages",
  },
  {
    id: 3,
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Happy Travelers",
  },
  {
    id: 4,
    icon: MapPinned,
    value: 24,
    suffix: "/7",
    label: "Travel Support",
  },
];

// 🔥 Counter with synced animation
function Counter({ end, duration = 2000, startAnimation, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const value = Math.floor(percentage * end);
      setCount(value);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [startAnimation, end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCounterSection() {
  const sectionRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);

  // 🔥 Intersection Observer (trigger once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-fixed bg-center bg-cover py-24"
      style={{ backgroundImage: "url('/package_hero1.webp')" }}
    >
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_20%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Our impact in travel
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-white md:text-5xl">
            Trusted By Travelers Who Expect More From Every Journey
          </h2>

          <p className="mt-5 text-base leading-8 text-white/75 md:text-lg">
            We bring together destination discovery, premium stays, and curated
            experiences to create a travel platform that feels polished and
            reliable.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.id}
                className="flex flex-col items-center text-center rounded-[30px] border border-white/10 bg-white/10 p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl"
              >
                {/* Icon centered */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Number centered */}
                <h3 className="mt-6 text-4xl font-bold md:text-5xl">
                  <Counter
                    end={item.value}
                    suffix={item.suffix}
                    startAnimation={startAnimation}
                  />
                </h3>

                {/* Label centered */}
                <p className="mt-3 text-base font-medium text-white/75">
                  {item.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
