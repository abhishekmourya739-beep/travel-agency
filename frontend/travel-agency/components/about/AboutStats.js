"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/common/GlassCard";
import AnimatedCounter from "@/components/common/AnimatedCounter";

const stats = [
  { label: "Destinations", value: 20, suffix: "+" },
  { label: "Luxury Packages", value: 100, suffix: "+" },
  { label: "Happy Travelers", value: 5, suffix: "K+" },
  { label: "Support", value: 24, suffix: "/7" },
];

export default function AboutStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
        >
          <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              {item.label}
            </p>
            <h3 className="mt-3 text-4xl font-semibold text-white">
              <AnimatedCounter value={item.value} suffix={item.suffix} />
            </h3>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
