import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ব্লগ — আস-সুন্নাহ স্কিল",
    description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের শিক্ষামূলক ব্লগ, টিপস ও আর্টিকেল।",
    openGraph: { title: "ব্লগ — আস-সুন্নাহ স্কিল", description: "শিক্ষামূলক ব্লগ ও আর্টিকেল" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
