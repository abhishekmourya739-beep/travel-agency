import ContactHero from "@/components/contact/ContactHero";
import ContactInfoGrid from "@/components/contact/ContactInfoGrid";
import ContactFormSection from "@/components/contact/ContactFormSection";
import ContactFAQ from "@/components/contact/ContactFAQ";
import ContactMapSection from "@/components/contact/ContactMapSection";
import ContactCTA from "@/components/contact/ContactCTA";

export default function ContactPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.10),transparent_30%),linear-gradient(to_bottom,#050816,#0b1020,#050816)]" />

      <div className="relative mx-auto max-w-7xl space-y-16 px-4 pb-20 pt-28 md:px-6 lg:px-8">
        <ContactHero />
        <ContactInfoGrid />
        <ContactFormSection />
        <ContactFAQ />
        <ContactMapSection />
        <ContactCTA />
      </div>
    </section>
  );
}
