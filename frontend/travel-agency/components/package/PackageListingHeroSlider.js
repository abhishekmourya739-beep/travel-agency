import Slider from "../global/Slider";

const slides = [
  {
    id: 1,
    image: "/package_hero1.webp",
    subtitle: "LET'S TRAVEL THE WORLD WITH US",

    titleLight: "DISCOVER",
    titleBold: "PREMIUM",
    titleBottom: "TRAVEL EXPERIENCES",
    description:
      "Explore curated journeys, premium stays, and unforgettable destinations designed for modern travelers.",
  },
  {
    id: 2,
    image: "/hero4.jpg",
    subtitle: "FIND AMAZING PLACES TO EXPLORE",

    titleLight: "EXPLORE",
    titleBold: "BEAUTIFUL",
    titleBottom: "DESTINATIONS",
    description:
      "From beach retreats to cultural getaways, discover immersive travel experiences built for comfort and style.",
  },
  {
    id: 3,
    image: "/package_hero3.jpg",
    subtitle: "MAKE YOUR JOURNEY UNFORGETTABLE",

    titleLight: "ENJOY",
    titleBold: "LUXURY",
    titleBottom: "HOLIDAYS",
    description:
      "Browse elegant, flexible travel options with high-quality stays, smooth planning, and memorable moments.",
  },
];

export default function PackageListingHeroSlider() {
  return (
    <Slider heroSlides={slides}>
      {/* CTA */}
      <div className="mt-8">
        <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 hover:text-white">
          Explore Packages
        </button>
      </div>
    </Slider>
  );
}
