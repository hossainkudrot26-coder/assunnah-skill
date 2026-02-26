import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ইভেন্ট ক্যালেন্ডার",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের আসন্ন সেমিনার, ওয়ার্কশপ, ভর্তি অনুষ্ঠান এবং কার্যক্রম।",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
