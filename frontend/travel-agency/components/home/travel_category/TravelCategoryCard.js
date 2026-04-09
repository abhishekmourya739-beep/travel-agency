import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function TravelCategoryCard({
  title,
  subtitle,
  image,
  href,
  large = false,
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[30px] border border-white/10 shadow-[0_20px_70px_rgba(15,23,42,0.12)] ${
        large ? "min-h-[420px]" : "min-h-[300px]"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes={
            large
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_24%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-7">
        <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md transition duration-300 group-hover:bg-white/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/75">{subtitle}</p>
              <h3 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
                {title}
              </h3>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition duration-300 group-hover:bg-cyan-500">
              <ArrowUpRight className="h-5 w-5 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
