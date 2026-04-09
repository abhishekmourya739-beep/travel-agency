import { getPackages } from "@/lib/api/package";
import { getAllLocations } from "@/lib/api/location";
import { createSlug } from "@/lib/utils/slug";
import PackagesPageClient from "@/components/package/PackagesPageClient";

export default async function PackagesPage({ searchParams }) {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);
  const locationSlug = params.location || "";
  const packageSlug = params.package || "";

  const allLocations = await getAllLocations();

  const matchedLocation = allLocations.find(
    (location) => createSlug(location?.name || "") === locationSlug,
  );

  const locationId = matchedLocation?._id;

  const searchTerm =
    params.search || (packageSlug ? packageSlug.split("-").join(" ") : "");

  const data = await getPackages({
    search: searchTerm || "",
    location: locationId || undefined,
    tripType: params.tripType || "",
    minPrice: params.minPrice || "",
    maxPrice: params.maxPrice || "",
    sort: params.sort || "",
    page: packageSlug ? 1 : page,
    limit: 10,
  });

  let packages = data?.packages || [];
  let pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  };

  if (packageSlug) {
    packages = packages.filter(
      (pkg) => createSlug(pkg?.title || "") === packageSlug,
    );

    pagination = {
      total: packages.length,
      page: 1,
      limit: 9,
      totalPages: 1,
    };
  }

  return (
    <PackagesPageClient
      packages={packages}
      pagination={pagination}
      filters={params}
      locations={allLocations}
    />
  );
}
