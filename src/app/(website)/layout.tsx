import { Header } from "@/modules/website/components/Header";
import { Footer } from "@/modules/website/components/Footer";
import { AnnouncementBar } from "@/modules/website/components/AnnouncementBar";
import { FloatingWhatsApp } from "@/modules/website/components/FloatingWhatsApp";

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
    </>
  );
}
