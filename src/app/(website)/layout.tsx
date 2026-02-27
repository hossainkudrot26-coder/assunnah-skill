import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import { AnnouncementBar } from "@/shared/components/AnnouncementBar";
import { FloatingWhatsApp } from "@/shared/components/FloatingWhatsApp";
import { ScrollToTop } from "@/shared/components/ScrollToTop";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <a href="#main-content" className="skip-to-content">
        মূল বিষয়বস্তুতে যান
      </a>
      <Header />
      <main id="main-content" role="main">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
