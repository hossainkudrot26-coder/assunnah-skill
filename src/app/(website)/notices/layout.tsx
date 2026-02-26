import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "নোটিশ বোর্ড",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের ভর্তি বিজ্ঞপ্তি, পরীক্ষার ফলাফল, ইভেন্ট ও সকল গুরুত্বপূর্ণ ঘোষণা।",
};

export default function NoticesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
