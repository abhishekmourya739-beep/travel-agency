import PackageDetailsClient from "@/components/package/details/PackageDetailsClient";
import { getPackageById } from "@/lib/api/package";

export default async function PackageDetailsPage({ params }) {
  const { id } = await params;
  const pkg = await getPackageById(id);

  return <PackageDetailsClient pkg={pkg} />;
}
