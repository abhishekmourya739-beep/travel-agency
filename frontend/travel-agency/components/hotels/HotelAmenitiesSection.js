import {
  Wifi,
  UtensilsCrossed,
  Dumbbell,
  Waves,
  Car,
  ShieldCheck,
  Coffee,
  AirVent,
  Tv,
  Bath,
} from "lucide-react";

const amenityIcons = {
  wifi: Wifi,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  pool: Waves,
  parking: Car,
  security: ShieldCheck,
  breakfast: Coffee,
  ac: AirVent,
  television: Tv,
  bathtub: Bath,
};

function getAmenityIcon(amenity = "") {
  const key = amenity.toLowerCase();

  if (key.includes("wifi")) return Wifi;
  if (key.includes("restaurant")) return UtensilsCrossed;
  if (key.includes("gym")) return Dumbbell;
  if (key.includes("pool")) return Waves;
  if (key.includes("parking")) return Car;
  if (key.includes("security")) return ShieldCheck;
  if (key.includes("breakfast")) return Coffee;
  if (key.includes("ac") || key.includes("air")) return AirVent;
  if (key.includes("tv")) return Tv;
  if (key.includes("bath")) return Bath;

  return amenityIcons[key] || ShieldCheck;
}

export default function HotelAmenitiesSection({ hotel }) {
  const amenities = hotel?.amenities || [];

  return (
    <section className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
        Amenities & Comfort
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.length > 0 ? (
          amenities.map((amenity, index) => {
            const Icon = getAmenityIcon(amenity);

            return (
              <div
                key={`${amenity}-${index}`}
                className="group rounded-3xl border border-slate-200/80 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {amenity}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Designed to make your stay smoother, more comfortable, and
                  more memorable.
                </p>
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-3xl bg-slate-50 p-6 text-slate-600">
            Amenities information is currently not available for this property.
          </div>
        )}
      </div>
    </section>
  );
}
