import { createSlug } from "@/lib/utils/slug";
import HotelsPageClient from "@/components/hotels/HotelsPageClient";
import getAllLocations from "@/lib/api/location";
import { getHotels } from "@/lib/api/hotel";

export default async function HotelsPage({ searchParams }) {
  const params = await searchParams;

  const locations = await getAllLocations();

  const matchedLocation = locations.find(
    (location) => createSlug(location?.name || "") === (params.location || ""),
  );

  const locationId = matchedLocation?._id || "";

  const hotelData = await getHotels({
    search: params.search || "",
    location: locationId,
    minPrice: params.minPrice || "",
    maxPrice: params.maxPrice || "",
    minRating: params.minRating || "",
    sort: params.sort || "",
    page: Number(params.page) || 1,
    limit: 8,
  });

  return (
    <HotelsPageClient
      hotels={hotelData?.hotels || []}
      pagination={hotelData?.pagination || {}}
      filters={{
        search: params.search || "",
        location: params.location || "",
        minPrice: params.minPrice || "",
        maxPrice: params.maxPrice || "",
        minRating: params.minRating || "",
        sort: params.sort || "",
      }}
      locations={locations || []}
    />
  );
}
