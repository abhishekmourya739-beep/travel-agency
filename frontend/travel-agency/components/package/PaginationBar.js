"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildPageList(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function PaginationBar({ pagination = {}, filters = {} }) {
  const router = useRouter();

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });

    query.set("page", String(page));
    router.push(`/packages?${query.toString()}`);
  };

  const pages = buildPageList(currentPage, totalPages);

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-12 min-w-12 items-center justify-center rounded-2xl px-3 text-sm font-medium text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`inline-flex h-12 min-w-12 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-slate-900 text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
