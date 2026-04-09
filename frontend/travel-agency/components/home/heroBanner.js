import Slider from "../global/Slider";
import HeroSearchClient from "./HeroSearchClient";

const heroSlides = [
  {
    id: 1,
    image: "/hero1.jpg",
    subtitle: "LET'S TRAVEL THE WORLD WITH US",
    titleLight: "DISCOVER",
    titleBold: "THE WORLD",
    titleBottom: "WITH OUR GUIDE",
  },
  {
    id: 2,
    image: "/hero2.jpg",
    subtitle: "FIND AMAZING PLACES TO EXPLORE",
    titleLight: "ENJOY",
    titleBold: "BEAUTIFUL",
    titleBottom: "DESTINATIONS",
  },
  {
    id: 3,
    image: "/hero3.jpg",
    subtitle: "MAKE YOUR JOURNEY UNFORGETTABLE",
    titleLight: "TRAVEL",
    titleBold: "AROUND",
    titleBottom: "THE GLOBE",
  },
];

export default function HeroBanner({ packages, locations }) {
  return (
    <Slider heroSlides={heroSlides}>
      <HeroSearchClient packages={packages} locations={locations} />
    </Slider>
  );
}
