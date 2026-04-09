import Navbar from "@/components/global/header";
import Footer from "@/components/global/footer";
import ScrollToTop from "@/components/global/scrollProgress";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh]">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
