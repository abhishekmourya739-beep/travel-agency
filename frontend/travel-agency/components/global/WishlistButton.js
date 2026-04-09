"use client";

import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { useState } from "react";
import { showToast } from "@/store/slices/toast.slice";

export default function WishlistButton({
  item,
  borderColor = "border-white/20",
  textColor = "text-white",
}) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [animate, setAnimate] = useState(false);

  const isWishlisted = wishlistItems.some((i) => i._id === item._id);

  const handleClick = () => {
    setAnimate(true);

    dispatch(toggleWishlistItem(item));

    dispatch(
      showToast({
        message: isWishlisted
          ? `${item?.name || item?.title} removed from wishlist`
          : `${item?.name || item?.title} added to wishlist ❤️`,
        type: "success",
      }),
    );

    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition ${
        isWishlisted
          ? "border-cyan-200 bg-cyan-50 text-cyan-600"
          : `${borderColor} bg-white/15 ${textColor} backdrop-blur-md hover:bg-white/20`
      }`}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-300 ${
          isWishlisted ? "fill-cyan-500 text-cyan-500" : ""
        } ${animate ? "scale-125" : "scale-100"}`}
      />

      {/* Pulse ring effect */}
      {animate && (
        <span className="absolute h-10 w-10 rounded-full bg-cyan-400/30 animate-ping" />
      )}
    </button>
  );
}
