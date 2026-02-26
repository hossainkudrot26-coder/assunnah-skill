import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "কোর্স তুলনা — পাশাপাশি তুলনা করুন",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের কোর্সসমূহ পাশাপাশি তুলনা করুন — সময়কাল, ফি, সিলেবাস ও সুবিধা।",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
