import { createSlug } from "@/lib/utils/slug";
import DestinationPageClient from "@/components/destinations/DestinationPageClient";
import getAllLocations from "@/lib/api/location";
import { getPackages } from "@/lib/api/package";
import { getHotels } from "@/lib/api/hotel";

export default async function DestinationPage({ params }) {
  const { slug } = await params;

  const allLocations = await getAllLocations();

  const location = allLocations.find(
    (item) => createSlug(item?.name || "") === slug,
  );

  if (!location) {
    return (
      <section className="min-h-screen bg-[#f4f7fb] px-4 pt-32">
        <div className="mx-auto max-w-4xl rounded-4xl bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Destination not found
          </h1>
          <p className="mt-4 text-slate-600">
            We couldn&apos;t find the destination you&apos;re looking for.
          </p>
        </div>
      </section>
    );
  }

  const [packageData, hotelData] = await Promise.all([
    getPackages({
      location: location._id,
      page: 1,
      limit: 12,
    }),
    getHotels({
      location: location._id,
      page: 1,
      limit: 8,
      sort: "ratingHigh",
    }),
  ]);

  return (
    <DestinationPageClient
      location={location}
      packages={packageData?.packages || []}
      hotels={hotelData?.hotels || []}
    />
  );
}
