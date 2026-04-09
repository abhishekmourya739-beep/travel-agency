import GlassCard from "@/components/common/GlassCard";

export default function ContactMapSection() {
  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-amber-200">
          Find Us
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
          Visit our location
        </h2>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="h-105 w-full">
          <iframe
            title="Mumbai Location"
            src="https://www.google.com/maps?q=Mumbai,Maharashtra,India&z=12&output=embed"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </GlassCard>
    </div>
  );
}
