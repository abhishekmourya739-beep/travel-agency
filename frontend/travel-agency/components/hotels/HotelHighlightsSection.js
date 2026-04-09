import { Sparkles, Shield, HeartHandshake, Gem } from "lucide-react";

const highlights = [
  {
    icon: Sparkles,
    title: "Premium Experience",
    desc: "Elegant interiors, polished comfort, and a stay designed to feel refined from arrival to checkout.",
  },
  {
    icon: Shield,
    title: "Reliable Hospitality",
    desc: "Professional service standards, secure environment, and trusted quality throughout your stay.",
  },
  {
    icon: HeartHandshake,
    title: "Guest-Focused Service",
    desc: "Thoughtful hospitality and smooth experiences tailored for leisure travelers and families alike.",
  },
  {
    icon: Gem,
    title: "Luxury Feel",
    desc: "A stylish destination stay with elevated details, visual appeal, and premium comfort.",
  },
];

export default function HotelHighlightsSection() {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
        Why You’ll Love This Stay
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6 transition hover:border-cyan-200 hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 leading-7 text-slate-600">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
