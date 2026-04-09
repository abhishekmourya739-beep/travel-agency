export default function DestinationOverview({ location }) {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/90 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
        About Destination
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-900">
        Why Visit {location?.name}?
      </h2>

      <p className="mt-4 text-base leading-7 text-slate-600 max-w-2xl">
        {location?.description ||
          `${location?.name} offers a premium blend of memorable travel experiences, curated stays, and beautifully designed holiday opportunities.`}
      </p>

      {/* 🔥 NEW: Highlights */}
      <div className="mt-6 flex flex-wrap gap-3">
        {["Culture", "Luxury Stays", "Local Food", "Sightseeing"].map(
          (item) => (
            <span
              key={item}
              className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700"
            >
              {item}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
