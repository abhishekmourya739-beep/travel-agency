"use client";

import { useState } from "react";
import { Send, Globe2, Headphones } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

export default function ContactFormSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    destination: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form:", form);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="space-y-6">
        <GlassCard className="p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-200">
            Why Reach Out
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            We’re here to make travel feel seamless.
          </h2>
          <p className="mt-5 leading-8 text-white/65">
            Whether you need help choosing a destination, planning a luxury
            getaway, or completing a booking, our team is here to assist you.
          </p>
        </GlassCard>

        <div className="grid gap-6 sm:grid-cols-2">
          <GlassCard className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10">
              <Globe2 className="h-6 w-6 text-sky-200" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Custom destination help
            </h3>
            <p className="mt-3 leading-7 text-white/65">
              Ask us about destinations, stays, packages, and the best travel
              fit for your style.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10">
              <Headphones className="h-6 w-6 text-emerald-200" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Reliable support
            </h3>
            <p className="mt-3 leading-7 text-white/65">
              Get quick help for bookings, payments, travel details, and trip
              planning questions.
            </p>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="p-6 md:p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-200">
            Send a Message
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Tell us about your next trip
          </h2>
          <p className="mt-3 text-white/65">
            Fill out the form and our team will get back to you with the right
            guidance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/30 focus:bg-white/6"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/30 focus:bg-white/6"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Preferred Destination
              </label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Bali, Greece, Turkey"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/30 focus:bg-white/6"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/30 focus:bg-white/6"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Message
            </label>
            <textarea
              name="message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what kind of trip you are planning..."
              className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/30 focus:bg-white/6"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="max-w-md text-sm leading-7 text-white/55">
              By sending this message, you allow us to contact you regarding
              your travel inquiry.
            </p>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-linear-to-r from-amber-300 via-yellow-200 to-orange-300 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Send Inquiry
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
