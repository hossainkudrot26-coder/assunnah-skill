import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "গ্যালারি",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের প্রশিক্ষণ, ইভেন্ট ও কার্যক্রমের ছবি",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
