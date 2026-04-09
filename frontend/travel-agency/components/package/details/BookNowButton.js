"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setBookingDraft } from "@/store/slices/bookingSlice";

export default function BookNowButton({ pkg }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBookNow = () => {
    dispatch(
      setBookingDraft({
        travelPackage: pkg._id,
        packageTitle: pkg.title,
        packagePrice: pkg.price,
        destination: pkg.location?.name,
        thumbnail: pkg.thumbnail?.url || "",
        duration: pkg.duration,
        numberOfPeople: 1,
        travelDate: "",
        paymentMethod: "upi",
      }),
    );

    router.push("/checkout");
  };

  return (
    <button
      onClick={handleBookNow}
      className=" w-full rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-cyan-600"
    >
      Book Now
    </button>
  );
}
