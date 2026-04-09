import { notFound } from "next/navigation";
import HotelDetailsPageClient from "@/components/hotels/HotelDetailsPageClient";
import { getHotelById } from "@/lib/api/hotel";
import { getPackages } from "@/lib/api/package";

export default async function HotelDetailsPage({ params }) {
  const { id } = await params;

  const hotel = await getHotelById(id);

  if (!hotel) {
    notFound();
  }

  const relatedPackagesData = await getPackages({
    location: hotel?.location?._id || hotel?.location,
    limit: 6,
    page: 1,
  });

  return (
    <HotelDetailsPageClient
      hotel={hotel}
      relatedPackages={relatedPackagesData?.packages || []}
    />
  );
}
