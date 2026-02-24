import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটে ভর্তি, কোর্স বা অন্য যেকোনো বিষয়ে যোগাযোগ করুন",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
