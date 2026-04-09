"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeWishlistItem } from "@/store/slices/wishlistSlice";
import { getOptimizedImageUrl } from "@/lib/utils/image";
import { showToast } from "@/store/slices/toast.slice";

export default function WishlistPageClient() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.wishlist.items);

  return (
    <section className="min-h-screen bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] px-4  py-2 w-fit bg-cyan-400 rounded-4xl text-white">
            Wishlist
          </p>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-5xl">
            Saved Travel Picks
          </h1>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items?.length ? (
            items.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              >
                <div className="relative h-72 overflow-hidden bg-slate-200">
                  <Image
                    src={
                      getOptimizedImageUrl(item?.thumbnail?.url, 900, 700) ||
                      "/hero2.jpg"
                    }
                    alt={item?.title || "Wishlist item"}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {item?.title || item?.name}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item?.description}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/packages/${item._id}`}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(removeWishlistItem(item._id));

                        dispatch(
                          showToast({
                            message: `${item?.name || item?.title} removed from wishlist`,
                            type: "success",
                          }),
                        );
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-4xl bg-white p-12 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                Your wishlist is empty
              </h2>
              <p className="mt-3 text-slate-600">
                Save favorite packages and revisit them anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
