import Slider from "@/components/global/Slider";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/hero3.jpg",
    subtitle: "FIND PREMIUM STAYS WORLDWIDE",
    titleLight: "DISCOVER",
    titleBold: "LUXURY",
    titleBottom: "HOTELS",
    description:
      "Browse elegant stays, curated comfort, and unforgettable hospitality across the world.",
  },
  {
    id: 2,
    image: "/hero4.jpg",
    subtitle: "STAY IN STYLE AND COMFORT",
    titleLight: "EXPLORE",
    titleBold: "PREMIUM",
    titleBottom: "ACCOMMODATIONS",
    description:
      "From city escapes to beachside retreats, find premium hotel experiences designed for modern travelers.",
  },
  {
    id: 3,
    image: "/package_hero1.webp",
    subtitle: "ELEVATE EVERY JOURNEY",
    titleLight: "ENJOY",
    titleBold: "EXCLUSIVE",
    titleBottom: "STAYS",
    description:
      "Experience refined comfort, exceptional amenities, and beautiful properties in top destinations.",
  },
];

export default function HotelsListingHeroSlider() {
  return (
    <Slider heroSlides={slides}>
      <div className="mt-8">
        <Link
          href="/hotels"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 hover:text-white"
        >
          Explore Hotels
        </Link>
      </div>
    </Slider>
  );
}
