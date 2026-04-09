import DestinationsMainPageClient from "@/components/destinations/DestinationMainPageClient";
import getAllLocations from "@/lib/api/location";

export default async function DestinationsPage() {
  const locations = await getAllLocations();

  return <DestinationsMainPageClient locations={locations} />;
}
