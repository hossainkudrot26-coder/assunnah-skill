import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ভর্তি প্রক্রিয়া",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটে ভর্তির ধাপসমূহ, প্রয়োজনীয় কাগজপত্র ও নির্দেশনা",
};

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
