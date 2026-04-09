import { BriefcaseBusiness, Hotel, Globe2 } from "lucide-react";

export default function DestinationStatsStrip({
  packageCount = 0,
  hotelCount = 0,
}) {
  const items = [
    {
      icon: BriefcaseBusiness,
      value: packageCount,
      label: "Packages",
    },
    {
      icon: Hotel,
      value: hotelCount,
      label: "Stays",
    },
    {
      icon: Globe2,
      value: "Luxury",
      label: "Style",
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border p-4 border-white/70 bg-white/90  shadow-sm"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Icon className="h-18 w-18" />
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
