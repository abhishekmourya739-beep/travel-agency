"use client";

import { Mail, Phone, MapPin, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "@/components/common/GlassCard";

const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    value: "travelagency@example.com",
    note: "For bookings, support, and partnerships",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+91 98765 43210",
    note: "Speak with our travel support team",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Mumbai, Maharashtra, India",
    note: "Premium assistance for modern travelers",
  },
  {
    icon: Clock3,
    title: "Working Hours",
    value: "Mon - Sat, 9:00 AM - 8:00 PM",
    note: "Quick response during business hours",
  },
];

export default function ContactInfoGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {contactCards.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <GlassCard className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
                <Icon className="h-6 w-6 text-amber-200" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-base font-medium text-white">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/60">
                {item.note}
              </p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
