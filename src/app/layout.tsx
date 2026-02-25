import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { AuthProvider } from "@/shared/components/AuthProvider";

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
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" dir="ltr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": siteConfig.name,
              "alternateName": siteConfig.nameBn,
              "url": siteConfig.url,
              "logo": siteConfig.logo,
              "description": siteConfig.descriptionEn,
              "foundingDate": "2022",
              "founder": {
                "@type": "Person",
                "name": siteConfig.founderEn,
              },
              "parentOrganization": {
                "@type": "Organization",
                "name": siteConfig.parentOrgEn,
                "url": siteConfig.parentOrgUrl,
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": siteConfig.contact.addressEn,
                "addressLocality": "Dhaka",
                "addressCountry": "BD",
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": siteConfig.contact.phone,
                "email": siteConfig.contact.email,
                "contactType": "customer service",
                "availableLanguage": ["bn", "en"],
              },
              "sameAs": [
                siteConfig.social.facebook,
                siteConfig.social.youtube,
              ],
            }),
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B8A50" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
