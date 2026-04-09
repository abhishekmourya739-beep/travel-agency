import { ShieldCheck, Headphones, Hotel, Sparkles } from "lucide-react";
import WhyChooseUsCard from "./WhyChooseUsCard";

const features = [
  {
    icon: Sparkles,
    title: "Curated Premium Experiences",
    description:
      "Every journey is crafted with destination quality, comfort, and premium moments in mind so travelers enjoy a seamless and elevated holiday experience.",
    badge: "Luxury",
    highlighted: true,
    points: [
      "Handpicked package combinations",
      "Destination-first premium planning",
      "Luxury feel from discovery to booking",
    ],
  },
  {
    icon: Hotel,
    title: "Handpicked Stays & Comfortable Hotels",
    description:
      "We focus on quality stays and thoughtful hospitality choices so every trip feels polished, trustworthy, and worth remembering.",
    badge: "Stay",
    points: [
      "Trusted hotels and premium stays",
      "Comfort-focused travel experiences",
      "Better accommodation curation",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable Booking Experience",
    description:
      "From clear package information to a dependable booking flow, our platform is built to create confidence at every step of the travel journey.",
    badge: "Trust",
    points: [
      "Transparent package details",
      "Secure and structured booking flow",
      "Built for traveler confidence",
    ],
  },
  {
    icon: Headphones,
    title: "Responsive Support When You Need It",
    description:
      "Travel feels better when support is accessible. Our platform experience is designed to feel smooth, responsive, and helpful from start to finish.",
    badge: "Support",
    points: [
      "Easy support-first experience",
      "Traveler-friendly assistance flow",
      "Help across package discovery and booking",
    ],
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8fbff] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.10),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_20%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
            <Sparkles className="h-4 w-4" />
            Why travelers choose us
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Designed For Premium Journeys, Built For Peace Of Mind
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
            We don&apos;t just list destinations — we create a more polished
            travel discovery experience with trusted stays, curated packages,
            secure booking flow, and premium visual storytelling.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <WhyChooseUsCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              badge={item.badge}
              highlighted={item.highlighted}
              points={item.points}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
