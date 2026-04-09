"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, BriefcaseBusiness } from "lucide-react";
import { useDispatch } from "react-redux";
import { createSlug } from "@/lib/utils/slug";
import SearchSelect from "./SearchSelect";
import { showToast } from "@/store/slices/toast.slice";

export default function HeroSearchClient({ packages = [], locations = [] }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const locationOptions = useMemo(() => {
    return locations.map((location) => ({
      ...location,
      slug: createSlug(location.name),
    }));
  }, [locations]);

  const filteredPackages = useMemo(() => {
    if (!selectedLocation) return packages;

    return packages.filter(
      (pkg) => createSlug(pkg.location?.name || "") === selectedLocation.slug,
    );
  }, [packages, selectedLocation]);

  const packageOptions = useMemo(() => {
    return filteredPackages.map((pkg) => ({
      ...pkg,
      slug: createSlug(pkg.title),
      subtitle: `${pkg.duration} Days`,
    }));
  }, [filteredPackages]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setSelectedPackage(null);
  };

  const handlePackageChange = (pkg) => {
    setSelectedPackage(pkg);
  };
  const handleFindNow = () => {
    const query = new URLSearchParams();
    if (!selectedLocation && !selectedPackage) {
      dispatch(
        showToast({
          message: "Please select a destination or package first.",
          type: "warning",
        }),
      );
      return;
    }

    if (selectedPackage?.slug) {
      dispatch(
        showToast({
          message: `Opening ${selectedPackage.title}.`,
          type: "success",
        }),
      );
      query.set("package", selectedPackage.slug);
    }
    if (selectedLocation?.slug) {
      query.set("location", selectedLocation.slug);
      dispatch(
        showToast({
          message: `Showing packages for ${selectedLocation.name}.`,
          type: "success",
        }),
      );
    }
    if (selectedPackage?.slug && selectedLocation?.slug) {
      dispatch(
        showToast({
          message: `Opening ${selectedPackage.title}.`,

          type: "success",
        }),
      );
    }

    router.push(`/packages?${query.toString()}`);
  };

  return (
    <div className="relative z-30 mt-14 w-full max-w-6xl overflow-visible rounded-[30px] border border-white/15 bg-white/10 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="grid grid-cols-1 overflow-visible rounded-[26px] bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.14)] md:grid-cols-[1fr_1fr_220px]">
        <div className="border-b border-slate-200 md:border-b-0 md:border-r">
          <div className="flex items-center gap-3">
            <div className="pl-5 text-slate-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <SearchSelect
                label="Destination"
                placeholder="Choose destination"
                options={locationOptions}
                value={selectedLocation}
                onChange={handleLocationChange}
                displayKey="name"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 md:border-b-0 md:border-r">
          <div className="flex items-center gap-3">
            <div className="pl-5 text-slate-400">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <SearchSelect
                label="Package"
                placeholder="Choose package"
                options={packageOptions}
                value={selectedPackage}
                onChange={handlePackageChange}
                displayKey="title"
                subTextKey="subtitle"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleFindNow}
          className="flex min-h-23 items-center justify-center gap-3 rounded-b-[26px] px-6 py-6 text-base font-semibold text-white transition md:rounded-b-none md:rounded-r-[26px] bg-cyan-500 hover:bg-cyan-600"
        >
          <Search className="h-5 w-5" />
          Find Now
        </button>
      </div>
    </div>
  );
}
