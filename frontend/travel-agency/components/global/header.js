"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  ChevronDown,
  Settings,
  CalendarDays,
  Heart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useAppSelector } from "@/store/hooks";
const navigation = [
  { name: "Home", href: "/" },
  { name: "Destinations", href: "/destinations" },
  { name: "Packages", href: "/packages" },
  { name: "Hotels", href: "/hotels" },

  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef(null);

  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const isTransparent = !isScrolled;

  const headerClasses = isTransparent
    ? "absolute top-0 left-0 w-full bg-transparent text-white"
    : "fixed top-0 left-0 w-full border-b border-white/10 bg-slate-950/70 text-white shadow-lg backdrop-blur-xl";

  const navLinkClasses = (isActive) =>
    `relative text-sm font-medium transition ${
      isActive ? "text-cyan-300" : "text-white/90 hover:text-cyan-300"
    }`;

  const getInitial = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  const imageUrl = user?.image?.url || "";

  if (loading) {
    return null;
  }

  return (
    <>
      <header className={`z-999 transition-all duration-300 ${headerClasses}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
                <Image
                  src={isTransparent ? "/logo-light.png" : "/logo.png"}
                  alt="Travel Logo"
                  fill
                  className="object-contain p-2"
                  sizes="48px"
                  priority
                />
              </div>

              <div className="leading-tight">
                <h2 className="text-lg font-bold tracking-wide text-white">
                  TravelNest
                </h2>
                <p className="text-xs text-white/70">
                  Discover your next journey
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 xl:flex">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={navLinkClasses(isActive)}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-2 left-0 h-0.5 bg-cyan-300 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 xl:flex">
              <Link
                href="/wishlist"
                className="relative inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
              >
                <Heart className="h-5 w-5" />

                {/* Badge */}
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-r from-pink-500 to-red-500 px-1 text-[10px] font-bold text-white shadow-lg">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {/* <Link
                href="/packages"
                className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Plan Trip
              </Link> */}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/my-bookings"
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    My Bookings
                  </Link>

                  <div className="relative z-1000" ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-2 py-1.5 pr-3 text-white transition hover:bg-white/15"
                    >
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-cyan-500/30 ring-1 ring-white/15">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={user?.name || "User"}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-white">
                            {getInitial(user?.name)}
                          </span>
                        )}
                      </div>

                      <div className="max-w-30 text-left">
                        <p className="truncate text-sm font-semibold">
                          {user?.name}
                        </p>
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 transition ${
                          profileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute right-0 top-[calc(100%+12px)] z-1100 w-72 rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
                        profileOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-2 opacity-0"
                      }`}
                    >
                      <div className="mb-3 rounded-2xl bg-white/5 p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-cyan-500/30">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={user?.name || "User"}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-white">
                                {getInitial(user?.name)}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {user?.name}
                            </p>
                            <p className="truncate text-xs text-white/65">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/90 transition hover:bg-white/5 hover:text-cyan-300"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>

                        <Link
                          href="/my-bookings"
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/90 transition hover:bg-white/5 hover:text-cyan-300"
                        >
                          <BookOpen className="h-4 w-4" />
                          My Bookings
                        </Link>

                        <Link
                          href="/account-settings"
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/90 transition hover:bg-white/5 hover:text-cyan-300"
                        >
                          <Settings className="h-4 w-4" />
                          Account Settings
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full border border-cyan-300/20 bg-cyan-400/15 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20 hover:text-white"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 xl:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-1200 bg-black/60 backdrop-blur-sm transition-all duration-300 xl:hidden ${
          mobileMenuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-1300 flex h-full w-[88%] max-w-sm flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-500 xl:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10">
              <Image
                src="/logo-light.png"
                alt="Travel Logo"
                fill
                className="object-contain p-2"
                sizes="44px"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">TravelNest</h2>
              <p className="text-xs text-white/65">
                Discover your next journey
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isAuthenticated && (
          <div className="border-b border-white/10 p-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-cyan-500/30">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={user?.name || "User"}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <span className="text-base font-semibold text-white">
                      {getInitial(user?.name)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">
                    {user?.name}
                  </p>
                  <p className="truncate text-sm text-white/65">
                    {user?.email}
                  </p>
                </div>
              </div>

              <Link
                href="/packages"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Plan My Trip
              </Link>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-2">
            <Link
              href="/wishlist"
              className="group relative flex items-center justify-between rounded-2xl px-4 py-3.5 pr-12 text-[15px] font-medium text-white/90 transition hover:bg-white/5 hover:text-cyan-300"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-cyan-300" />
                <span>Wishlist</span>
              </div>

              {wishlistCount > 0 && (
                <span className="absolute right-4 top-1/2 inline-flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-linear-to-r from-pink-500 to-red-500 px-1.5 text-[10px] font-bold leading-none text-white shadow-lg  ring-slate-950">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {navigation.map((item, index) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-400/15 text-cyan-300"
                      : "text-white/90 hover:bg-white/5 hover:text-cyan-300"
                  }`}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 60}ms` : "0ms",
                    transform: mobileMenuOpen
                      ? "translateX(0)"
                      : "translateX(20px)",
                    opacity: mobileMenuOpen ? 1 : 0,
                  }}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  <User className="h-5 w-5 text-cyan-300" />
                  My Profile
                </Link>

                <Link
                  href="/my-bookings"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  <BookOpen className="h-5 w-5 text-cyan-300" />
                  My Bookings
                </Link>

                <Link
                  href="/account-settings"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  <Settings className="h-5 w-5 text-cyan-300" />
                  Account Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block rounded-2xl bg-cyan-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
