import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "সচরাচর জিজ্ঞাসা (FAQ)",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
