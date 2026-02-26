import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "নোটিশ বোর্ড — ভর্তি, পরীক্ষা ও ঘোষণা",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের সকল ভর্তি বিজ্ঞপ্তি, পরীক্ষার সময়সূচি, ফলাফল এবং গুরুত্বপূর্ণ ঘোষণা।",
};

export default function NoticesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
