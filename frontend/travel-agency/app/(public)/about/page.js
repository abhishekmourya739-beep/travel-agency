import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.10),transparent_28%),linear-gradient(to_bottom,#050816,#0b1020,#050816)]" />

      <div className="relative mx-auto max-w-7xl space-y-20 px-4 pb-20 pt-28 md:px-6 lg:px-8">
        <AboutHero />
        <AboutStats />
        <AboutValues />
        <AboutTeam />
        <AboutCTA />
      </div>
    </section>
  );
}
