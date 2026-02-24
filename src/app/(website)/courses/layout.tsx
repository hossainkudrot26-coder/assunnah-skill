import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "কোর্সসমূহ",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের সকল কোর্স — ব্যবসা, প্রযুক্তি, কারিগরি প্রশিক্ষণ",
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
