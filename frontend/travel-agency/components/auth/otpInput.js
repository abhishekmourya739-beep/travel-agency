"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function OtpInput({
  value = "",
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  hasError = false,
  isSuccess = false,
  autoFocus = true,
  masked = false,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showCaret, setShowCaret] = useState(true);

  const normalizedValue = useMemo(() => {
    return String(value ?? "")
      .replace(/\D/g, "")
      .slice(0, length);
  }, [value, length]);

  const digits = useMemo(() => {
    return Array.from({ length }, (_, i) => normalizedValue[i] || "");
  }, [normalizedValue, length]);

  const activeIndex = useMemo(() => {
    if (!isFocused) return -1;
    return Math.min(normalizedValue.length, length - 1);
  }, [isFocused, normalizedValue, length]);

  useEffect(() => {
    if (!autoFocus || disabled) return;

    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(id);
  }, [autoFocus, disabled]);

  useEffect(() => {
    if (!isFocused) return;

    const interval = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [isFocused]);

  const focusInput = () => {
    if (disabled) return;
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    const nextValue = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange?.(nextValue);

    if (nextValue.length === length) {
      onComplete?.(nextValue);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
    }
  };

  const getBoxClasses = (index) => {
    const isFilled = !!digits[index];
    const isActive = activeIndex === index;

    let stateClasses =
      "border-white/10 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";

    if (isSuccess) {
      stateClasses =
        "border-emerald-300/70 bg-emerald-400/10 shadow-[0_0_0_4px_rgba(16,185,129,0.12),0_0_28px_rgba(16,185,129,0.20)]";
    } else if (hasError) {
      stateClasses =
        "border-red-400/70 bg-red-500/10 shadow-[0_0_0_4px_rgba(248,113,113,0.10)]";
    } else if (isActive) {
      stateClasses =
        "border-cyan-300/80 bg-white/15 shadow-[0_0_0_4px_rgba(34,211,238,0.12),0_10px_30px_rgba(34,211,238,0.08)]";
    } else if (isFilled) {
      stateClasses =
        "border-white/15 bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
    }

    return `relative flex h-12 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border text-base font-semibold text-white transition-all duration-200 sm:h-14 sm:text-lg ${stateClasses}`;
  };

  return (
    <div className="w-full">
      <div
        className={`relative mx-auto w-full max-w-[360px] ${
          hasError ? "animate-[shake_0.35s_ease-in-out]" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          enterKeyHint="done"
          value={normalizedValue}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setShowCaret(true);
          }}
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
          aria-label={`Enter ${length}-digit OTP`}
        />

        <div
          onClick={focusInput}
          className="grid cursor-text gap-2 sm:gap-3"
          style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
        >
          {digits.map((digit, index) => {
            const isActive = activeIndex === index;
            const shouldShowCaret =
              isActive && !digit && isFocused && showCaret && !disabled;

            return (
              <div key={index} className={getBoxClasses(index)}>
                <span
                  className={`transition-all duration-150 ${
                    digit ? "scale-100 opacity-100" : "scale-95 opacity-90"
                  }`}
                >
                  {digit ? (masked ? "•" : digit) : ""}
                </span>

                {shouldShowCaret && (
                  <span className="absolute h-5 w-[2px] rounded-full bg-cyan-300 sm:h-6" />
                )}

                {!digit && !shouldShowCaret && (
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
