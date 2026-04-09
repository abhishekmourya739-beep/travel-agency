"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Mail, MapPin, Send } from "lucide-react";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

const contactItems = [
  {
    id: 1,
    title: "Call us",
    value: "+1 123-456-0606",
    icon: PhoneCall,
  },
  {
    id: 2,
    title: "Write to us",
    value: "info@travolagency.com",
    icon: Mail,
  },
  {
    id: 3,
    title: "Address",
    value: "24 King St, SC 29401 USA",
    icon: MapPin,
  },
];

const footerLinks = [
  { id: 1, name: "About", href: "/about" },
  { id: 2, name: "Tours", href: "/packages" },
  { id: 3, name: "Destinations", href: "/destinations" },
  { id: 4, name: "Contact", href: "/contact" },
];

const socialLinks = [
  { id: 1, icon: FaInstagram, href: "/" },
  { id: 2, icon: FaTwitter, href: "/" },
  { id: 3, icon: FaFacebookF, href: "/" },
  { id: 4, icon: FaYoutube, href: "/" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#020617] text-white">
      {/* 🔥 Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        {/* 🔥 Contact Strip */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {contactItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`group flex items-center gap-5 px-8 py-7 transition ${
                    index !== contactItems.length - 1
                      ? "border-b border-white/10 md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-500 text-white shadow-lg transition group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔥 Main Footer */}
        <div className="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo-light.png"
                alt="Travel Agency Logo"
                width={170}
                height={60}
                priority
              />
            </Link>

            <p className="mt-6 max-w-md leading-7 text-white/60">
              Discover curated destinations, premium stays, and unforgettable
              journeys crafted for travelers who seek more than just trips.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition hover:scale-110 hover:bg-cyan-500 hover:text-white hover:shadow-lg"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="lg:mx-auto">
            <h3 className="text-2xl font-semibold tracking-wide">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-3 text-white/60">
              {footerLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="relative inline-block transition hover:text-cyan-400"
                  >
                    {item.name}
                    <span className="absolute left-0 -bottom-1 h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-2xl font-semibold tracking-wide">
              Stay Updated
            </h3>

            <p className="mt-6 max-w-md leading-7 text-white/60">
              Get exclusive travel deals, insider tips, and curated experiences
              delivered to your inbox.
            </p>

            <form className="mt-6 flex w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-5 py-4 text-white placeholder:text-white/40 outline-none"
              />

              <button
                type="submit"
                className="flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-4 font-medium text-white transition hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 md:flex-row">
          <p className="text-sm text-white/50">
            © 2026 Travel Agency. Crafted with premium experience.
          </p>

          <div className="flex gap-6 text-sm text-white/50">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
