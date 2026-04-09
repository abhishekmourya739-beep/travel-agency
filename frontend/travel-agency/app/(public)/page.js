import CtaBannerSection from "@/components/home/cta_banner/CtaSection";
import StatsCounterSection from "@/components/home/cta_banner/Stats";
import Destinations from "@/components/home/Destinations";
import FeaturedPackagesSection from "@/components/home/featured_package/FeaturedPackagesSection";
import HeroBanner from "@/components/home/heroBanner";
import TestimonialsSection from "@/components/home/testimonials/TestimonialSection";
import TravelCategoriesSection from "@/components/home/travel_category/TravelCategorySection";
import WhyChooseUsSection from "@/components/home/why_choose_us/WhyChooseUsSection";
import getAllLocations from "@/lib/api/location";
import {
  getAllPackagesSearchData,
  getFeaturedPackages,
} from "@/lib/api/package";

export default async function Home() {
  const [packages, allLocations, featuredPackages] = await Promise.all([
    getAllPackagesSearchData(),
    getAllLocations(),
    getFeaturedPackages(),
  ]);

  const heroLocations = allLocations.filter((location) =>
    packages.some((pkg) => pkg.location?._id === location._id),
  );
  return (
    <>
      <HeroBanner packages={packages} locations={heroLocations} />
      <Destinations locations={allLocations} />
      <FeaturedPackagesSection packages={featuredPackages} />
      <WhyChooseUsSection />
      <StatsCounterSection />

      <TravelCategoriesSection />
      <TestimonialsSection />
      <CtaBannerSection />
    </>
  );
}
