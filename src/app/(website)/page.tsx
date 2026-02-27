import { getPublishedCourses, getTestimonials, getSettings } from "@/lib/actions/data";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.nameBn} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: ["আস-সুন্নাহ", "স্কিল ডেভেলপমেন্ট", "কারিগরি প্রশিক্ষণ", "NSDA", "কম্পিউটার কোর্স", "ঢাকা"],
  openGraph: {
    title: `${siteConfig.nameBn} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "bn_BD",
  },
  twitter: { card: "summary_large_image", title: siteConfig.nameBn, description: siteConfig.description },
};
import {
  BriefcaseIcon, ChefHatIcon, ScissorsIcon, ChartIcon,
  CodeIcon, CarIcon, TargetIcon, BookIcon,
} from "@/shared/components/Icons";
import HomePageClient from "./HomePageClient";

/* ═══════════════════════════════════════════
   ICON MAP — maps DB iconName → JSX
   ═══════════════════════════════════════════ */

const iconMap: Record<string, (color: string) => React.ReactNode> = {
  BriefcaseIcon: (c) => <BriefcaseIcon size={26} color={c} />,
  ChefHatIcon: (c) => <ChefHatIcon size={26} color={c} />,
  ChartIcon: (c) => <ChartIcon size={26} color={c} />,
  ScissorsIcon: (c) => <ScissorsIcon size={26} color={c} />,
  CodeIcon: (c) => <CodeIcon size={26} color={c} />,
  CarIcon: (c) => <CarIcon size={26} color={c} />,
  TargetIcon: (c) => <TargetIcon size={26} color={c} />,
  BookIcon: (c) => <BookIcon size={26} color={c} />,
};

function getIcon(iconName: string | null | undefined, color: string) {
  if (iconName && iconMap[iconName]) return iconMap[iconName](color);
  return <BookIcon size={26} color={color} />;
}

/* ═══════════════════════════════════════════
   STATIC FALLBACK DATA
   ═══════════════════════════════════════════ */

const fallbackCourses = [
  { id: "1", slug: "small-business-management", title: "স্মল বিজনেস ম্যানেজমেন্ট", shortDesc: "MS Office, প্র্যাকটিক্যাল অ্যাকাউন্টিং, গ্রাফিক ডিজাইন, ক্রিয়েটিভ মার্কেটিং, ভিডিও এডিটিং, জেনারেটিভ AI, প্র্যাকটিক্যাল ইংলিশ ও মৌলিক দীনি জ্ঞান", duration: "৩ মাস", type: "রেসিডেন্সিয়াল", iconName: "BriefcaseIcon", color: "#1B8A50", isFeatured: true },
  { id: "2", slug: "chef-training", title: "শেফ ট্রেনিং অ্যান্ড কিচেন ম্যানেজমেন্ট", shortDesc: "দৈনিক ১২-১৪ ঘণ্টা প্র্যাকটিক্যাল ট্রেনিং, ২৪ ঘণ্টা মেন্টর সাপোর্ট, রেসিডেন্সিয়াল — সম্পূর্ণ বিনামূল্যে", duration: "৪ মাস", type: "ফ্রি", iconName: "ChefHatIcon", color: "#E65100", isFeatured: false },
  { id: "3", slug: "sales-and-marketing", title: "দি আর্ট অব সেলস অ্যান্ড মার্কেটিং", shortDesc: "সেলস স্ট্র্যাটেজি, কমিউনিকেশন, ব্র্যান্ডিং ও মার্কেটিং — ১০০% পর্যন্ত স্কলারশিপ সুবিধা", duration: "৩ মাস", type: "রেসিডেন্সিয়াল", iconName: "ChartIcon", color: "#1565C0", isFeatured: false },
  { id: "4", slug: "smart-tailoring", title: "স্মার্ট টেইলারিং এন্ড ফ্যাশন ডিজাইন", shortDesc: "টেইলারিং, টাই-ডাই, ব্লক-বাটিক, এমব্রয়ডারি — প্রশিক্ষণ শেষে ৫০,০০০+ টাকার সেলাই মেশিন ও সরঞ্জাম প্রদান", duration: "৩ মাস", type: "নারীদের জন্য", iconName: "ScissorsIcon", color: "#AD1457", isFeatured: false },
  { id: "5", slug: "shoe-entrepreneurship", title: "জুতা শিল্পে উদ্যোক্তা", shortDesc: "জুতা ডিজাইন, উৎপাদন ও বিপণন — প্রশিক্ষণ শেষে আস-সুন্নাহ ফাউন্ডেশন থেকে আর্থিক সহায়তা", duration: "৩ মাস", type: "ফ্রি", iconName: "TargetIcon", color: "#795548", isFeatured: false },
  { id: "6", slug: "driving-training", title: "ড্রাইভিং ট্রেনিং", shortDesc: "দক্ষ ও সৎ ড্রাইভার তৈরির পেশাদার প্রশিক্ষণ", duration: "১ মাস", type: "ফ্রি", iconName: "CarIcon", color: "#2E7D32", isFeatured: false },
];

const fallbackTestimonials = [
  { id: "1", name: "আব্দুল্লাহ আল মামুন", batch: "স্মল বিজনেস ম্যানেজমেন্ট - ব্যাচ ৩", story: "এই কোর্সের মাধ্যমে আমি নিজের ব্যবসা শুরু করতে পেরেছি। গ্রাফিক ডিজাইন ও ডিজিটাল মার্কেটিং শিখে এখন অনলাইনে আয় করছি।", initials: "আম" },
  { id: "2", name: "ফাতেমা খাতুন", batch: "স্মার্ট টেইলারিং - ব্যাচ ২", story: "আমি এখন নিজের বাড়িতে বসে টেইলারিং ব্যবসা চালাচ্ছি। আস-সুন্নাহ স্কিলে শিখেছি কিভাবে ব্যবসা পরিচালনা করতে হয়।", initials: "ফখ" },
  { id: "3", name: "মোহাম্মদ হাসান", batch: "শেফ ট্রেনিং - ব্যাচ ১", story: "শেফ ট্রেনিং কোর্স আমার জীবন বদলে দিয়েছে। এখন একটি রেস্টুরেন্টে কাজ করছি এবং ভালো আয় করছি।", initials: "মহ" },
];

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type DBCourse = Awaited<ReturnType<typeof getPublishedCourses>>[number];
type DBTestimonial = Awaited<ReturnType<typeof getTestimonials>>[number];

interface MarqueeStat { value: string; label: string }
interface ImpactCounter { end: number; suffix: string; label: string }
interface PartnerData { name: string; abbr: string; color: string; desc: string }

/* ═══════════════════════════════════════════
   SERVER COMPONENT — DATA FETCHING
   ═══════════════════════════════════════════ */

export default async function HomePage() {
  // Fetch from DB with fallback — properly typed
  let dbCourses: DBCourse[] = [];
  let dbTestimonials: DBTestimonial[] = [];
  let dynamicStats: MarqueeStat[] | null = null;
  let dynamicImpact: ImpactCounter[] | null = null;
  let dynamicPartners: PartnerData[] | null = null;

  try {
    dbCourses = await getPublishedCourses();
  } catch {
    dbCourses = [];
  }

  try {
    dbTestimonials = await getTestimonials();
  } catch {
    dbTestimonials = [];
  }

  // Fetch dynamic settings for homepage
  try {
    const settings = await getSettings([
      "trainedStudents", "activeCourses", "computerLabs",
      "onlineStudents", "campusArea", "scholarshipPercent",
      "trainedStudentsCount", "completedBatches", "employmentRate", "campusAreaSqft",
      "partners",
    ]);

    // Build marquee stats if any are set
    if (settings.trainedStudents || settings.activeCourses) {
      dynamicStats = [
        { value: settings.trainedStudents || "২,৫০০+", label: "প্রশিক্ষিত শিক্ষার্থী" },
        { value: settings.activeCourses || "২০+", label: "চালু কোর্স" },
        { value: settings.computerLabs || "৭টি", label: "কম্পিউটার ল্যাব" },
        { value: settings.onlineStudents || "১০,৯৬২+", label: "অনলাইন শিক্ষার্থী" },
        { value: settings.campusArea || "২৪,০০০", label: "স্কয়ার ফিট ক্যাম্পাস" },
        { value: settings.scholarshipPercent || "১০০%", label: "স্কলারশিপ সুবিধা" },
      ];
    }

    // Build impact counters if any are set
    if (settings.trainedStudentsCount || settings.completedBatches) {
      dynamicImpact = [
        { end: Number(settings.trainedStudentsCount) || 2500, suffix: "+", label: "প্রশিক্ষিত শিক্ষার্থী" },
        { end: Number(settings.completedBatches) || 15, suffix: "টি", label: "সম্পন্ন ব্যাচ" },
        { end: Number(settings.employmentRate) || 95, suffix: "%", label: "কর্মসংস্থান হার" },
        { end: Number(settings.campusAreaSqft) || 24000, suffix: "", label: "স্কয়ার ফিট ক্যাম্পাস" },
      ];
    }

    // Partners
    if (settings.partners && Array.isArray(settings.partners) && settings.partners.length > 0) {
      dynamicPartners = settings.partners;
    }
  } catch {
    // Fallback to hardcoded defaults in HomePageClient
  }

  // Map DB courses to display format with icons
  const courses = dbCourses.length > 0
    ? dbCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      desc: c.shortDesc,
      duration: c.duration,
      type: c.type,
      icon: getIcon(c.iconName, c.color),
      color: c.color,
      featured: c.isFeatured,
    }))
    : fallbackCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      desc: c.shortDesc,
      duration: c.duration,
      type: c.type,
      icon: getIcon(c.iconName, c.color),
      color: c.color,
      featured: c.isFeatured,
    }));

  // Map DB testimonials
  const testimonials = dbTestimonials.length > 0
    ? dbTestimonials.map((t) => ({
      name: t.name,
      batch: t.batch,
      text: t.story,
      initials: t.initials || t.name.slice(0, 2),
    }))
    : fallbackTestimonials.map((t) => ({
      name: t.name,
      batch: t.batch,
      text: t.story,
      initials: t.initials || t.name.slice(0, 2),
    }));

  return (
    <HomePageClient
      courses={courses}
      testimonials={testimonials}
      stats={dynamicStats}
      impactNumbers={dynamicImpact}
      partners={dynamicPartners}
    />
  );
}
