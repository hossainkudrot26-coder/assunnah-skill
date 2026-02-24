import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.shortNameBn} — ${siteConfig.description}`,
    template: `%s | ${siteConfig.shortNameBn}`,
  },
  description: siteConfig.description,
  keywords: [
    "আস-সুন্নাহ",
    "স্কিল ডেভেলপমেন্ট",
    "প্রশিক্ষণ",
    "দক্ষতা",
    "কর্মসংস্থান",
    "As-Sunnah",
    "Skill Development",
    "Training",
    "Bangladesh",
  ],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
