"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";

const faqs = [
  {
    question: "Can I request a custom travel package?",
    answer:
      "Yes. You can contact us with your destination, budget, travel style, and dates, and we can help guide you toward the best package.",
  },
  {
    question: "Do you offer support after booking?",
    answer:
      "Yes. We aim to provide continued assistance for booking questions, travel details, and other important trip-related concerns.",
  },
  {
    question: "Can I cancel my booking later?",
    answer:
      "Yes, based on the booking status and your cancellation flow. Your My Bookings page will show the available actions.",
  },
  {
    question: "How quickly will I get a response?",
    answer:
      "Usually during business hours, responses are much faster. You can also use the contact details on this page for direct communication.",
  },
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      <SectionHeading
        badge="FAQ"
        title="Common questions from travelers"
        description="A few quick answers about support, custom planning, and booking help."
      />

      <div className="mx-auto mt-10 max-w-4xl space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <GlassCard
              key={faq.question}
              className="group overflow-hidden border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.06]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-cyan-100">
                  {faq.question}
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-white/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 text-[15px] leading-7 text-white/65">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
