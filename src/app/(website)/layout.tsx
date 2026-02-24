import { Header } from "@/modules/website/components/Header";
import { Footer } from "@/modules/website/components/Footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        মূল বিষয়বস্তুতে যান
      </a>
      <Header />
      <main id="main-content" role="main">{children}</main>
      <Footer />
    </>
  );
}
