import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "কোর্স ফাইন্ডার — আপনার জন্য সেরা কোর্স",
  description: "কয়েকটি সহজ প্রশ্নের উত্তর দিন, আমরা আপনার জন্য সবচেয়ে উপযুক্ত কোর্স খুঁজে দেবো। আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট।",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
