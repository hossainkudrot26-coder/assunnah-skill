import { Header } from "@/modules/website/components/Header";
import { Footer } from "@/modules/website/components/Footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
