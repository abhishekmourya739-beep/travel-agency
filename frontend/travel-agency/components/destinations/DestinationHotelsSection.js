import { Sparkles } from "lucide-react";
import DestinationHotelCard from "./cards/DestinationHotelCard";

export default function DestinationHotelsSection({ location, hotels = [] }) {
  if (!hotels.length) return null;

  return (
    <section className="mt-14">
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
          <Sparkles className="h-4 w-4" />
          Premium stays in {location?.name}
        </div>

        <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-5xl">
          Luxury Hotels & Stays
        </h2>

        <p className="mt-4 text-base leading-8 text-slate-600">
          Browse refined accommodations, premium rooms, and elegant stay options
          available in this destination.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {hotels.map((hotel, index) => (
          <DestinationHotelCard key={hotel._id} hotel={hotel} index={index} />
        ))}
      </div>
    </section>
  );
}
