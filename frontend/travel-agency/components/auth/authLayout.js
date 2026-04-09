"use client";

import {
  ShieldCheck,
  Plane,
  Sparkles,
  Globe2,
  MapPinned,
  BadgeCheck,
} from "lucide-react";

export default function AuthLayout({ children }) {
  const features = [
    {
      icon: Plane,
      title: "Book smarter",
      text: "Plan trips, compare packages, and manage bookings in one place.",
    },
    {
      icon: ShieldCheck,
      title: "Secure account",
      text: "Your profile, bookings, and account actions stay protected.",
    },
    {
      icon: Globe2,
      title: "Travel globally",
      text: "Discover destinations, hotels, and curated journeys worldwide.",
    },
  ];

  const stats = [
    { label: "Destinations", value: "120+" },
    { label: "Happy Travelers", value: "8k+" },
    { label: "Verified Packages", value: "450+" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[15%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* content */}
      <div className="relative z-10 flex min-h-screen items-start justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-7xl overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left Panel */}
          <div className="relative hidden overflow-hidden border-r border-white/10 lg:block">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/15 via-slate-950/20 to-fuchsia-500/10" />

            <div className="relative flex h-full min-h-190 flex-col p-8 xl:p-10">
              {/* Top */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  Premium Travel Experience
                </div>

                <h1 className="mt-8 max-w-xl text-4xl font-bold leading-tight text-white xl:text-5xl">
                  Explore the world with a smarter travel account.
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                  Create your account to manage bookings, save travel details,
                  personalize your profile, and unlock a smoother journey from
                  planning to checkout.
                </p>
              </div>

              {/* Middle Showcase */}
              <div className="my-8 flex-1">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cyan-200">
                        Travel Dashboard Preview
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-white">
                        Your trips, bookings, and profile in one place
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
                      <MapPinned className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {stats.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"
                      >
                        <p className="text-xl font-bold text-white">
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                        <BadgeCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Personalized travel experience
                        </p>
                        <p className="text-xs text-slate-400">
                          Save profile info, manage bookings, and access plans
                          faster.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              Bali Escape
                            </p>
                            <p className="text-xs text-slate-400">
                              5 nights · 2 travelers
                            </p>
                          </div>
                          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                            Confirmed
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              Dubai Adventure
                            </p>
                            <p className="text-xs text-slate-400">
                              4 nights · Family package
                            </p>
                          </div>
                          <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-medium text-cyan-300">
                            Upcoming
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Features */}
              <div className="grid gap-4">
                {features.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="relative flex items-start justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
