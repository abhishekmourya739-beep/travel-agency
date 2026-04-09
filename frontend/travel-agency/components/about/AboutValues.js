"use client";

import { Globe2, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";

const values = [
  {
    icon: Globe2,
    title: "Curated Global Escapes",
    description:
      "Handpicked destinations, refined stays, and elegant experiences designed for modern travelers.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Travel Planning",
    description:
      "Transparent booking, reliable support, and thoughtful planning from the first click to the final arrival.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Service",
    description:
      "Every journey feels more meaningful when it reflects your pace, comfort, and travel preferences.",
  },
];

export default function AboutValues() {
  return (
    <div>
      <SectionHeading
        badge="Our Values"
        title="The principles behind every memorable booking"
        description="We blend premium design, human service, and curated travel planning into one polished experience."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {values.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <GlassCard className="group p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-300/30">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
                  <Icon className="h-7 w-7 text-amber-200" />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-white/65">
                  {item.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
