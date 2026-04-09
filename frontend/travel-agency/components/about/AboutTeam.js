"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";

const team = [
  {
    name: "Sophia Carter",
    role: "Luxury Travel Director",
    image: "/avatars/avatar-1.webp",
  },
  {
    name: "Ethan Brooks",
    role: "Destination Experience Lead",
    image: "/avatars/avatar-2.webp",
  },
  {
    name: "Isabella Reed",
    role: "Guest Journey Specialist",
    image: "/avatars/avatar-3.webp",
  },
  {
    name: "Noah Bennett",
    role: "Premium Support Manager",
    image: "/avatars/avatar-4.webp",
  },
];

export default function AboutTeam() {
  return (
    <div>
      <SectionHeading
        badge="Our Team"
        title="The people behind your premium travel experience"
        description="A thoughtful team focused on creating journeys that feel smooth, elevated, and unforgettable."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <GlassCard className="overflow-hidden p-0">
              <div className="relative h-72">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">
                  {member.name}
                </h3>
                <p className="mt-2 text-white/60">{member.role}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
