import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function WhyChooseUsCard({
  icon: Icon,
  title,
  description,
  badge,
  highlighted = false,
  points = [],
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[34px] border p-7 transition duration-300 hover:-translate-y-2 ${
        highlighted
          ? "border-cyan-200 bg-[linear-gradient(135deg,rgba(6,182,212,0.12),rgba(255,255,255,0.94))] shadow-[0_24px_90px_rgba(6,182,212,0.12)]"
          : "border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] hover:bg-[linear-gradient(135deg,rgba(6,182,212,0.05),rgba(255,255,255,1))] hover:shadow-[0_26px_90px_rgba(15,23,42,0.14)]"
      }`}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-0.5 w-0 -translate-x-1/2 rounded-full bg-cyan-500 transition-all duration-500 group-hover:w-1/2" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.10),transparent_24%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-[22px] transition duration-500 group-hover:rotate-12 ${
              highlighted
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-slate-100 text-cyan-600"
            }`}
          >
            <Icon className="h-7 w-7" />
          </div>

          {badge ? (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {badge}
            </span>
          ) : null}
        </div>

        <h3 className="mt-7 text-[26px] font-bold leading-tight text-slate-900">
          {title}
        </h3>

        <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>

        {points.length > 0 ? (
          <div className="mt-6 space-y-3">
            {points.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 text-sm leading-7 text-slate-600"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-600" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
          Learn More
          <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
}
