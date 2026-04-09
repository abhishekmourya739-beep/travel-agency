import { Sparkles } from "lucide-react";
import TravelCategoryCard from "./TravelCategoryCard";

const categories = [
  {
    title: "Adventure",
    subtitle: "Thrill-filled escapes",
    image: "/hero1.jpg",
    href: "/packages?tripType=adventure",
    large: true,
  },
  {
    title: "Relaxation",
    subtitle: "Peaceful coastal retreats",
    image: "/hero2.jpg",
    href: "/packages?tripType=relaxation",
  },
  {
    title: "Cultural",
    subtitle: "Immersive local experiences",
    image: "/hero4.jpg",
    href: "/packages?tripType=cultural",
  },
  {
    title: "Romantic",
    subtitle: "Memorable getaways for couples",
    image: "/package_hero1.webp",
    href: "/packages?search=romantic",
    large: true,
  },
  {
    title: "Family",
    subtitle: "Comfortable trips for everyone",
    image: "/package_hero2.jpg",
    href: "/packages?search=family",
  },
  {
    title: "Luxury",
    subtitle: "Premium stays and refined journeys",
    image: "/package_hero3.jpg",
    href: "/packages?search=luxury",
  },
];

export default function TravelCategoriesSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f7fb] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.04),transparent_18%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
              <Sparkles className="h-4 w-4" />
              Explore by style
            </div>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Choose A Journey That Matches Your Travel Mood
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
              Whether you want relaxation, romance, adventure, or cultural
              depth, discover beautifully curated journeys shaped around how you
              want to travel.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <TravelCategoryCard
              key={category.title}
              title={category.title}
              subtitle={category.subtitle}
              image={category.image}
              href={category.href}
              large={category.large}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
