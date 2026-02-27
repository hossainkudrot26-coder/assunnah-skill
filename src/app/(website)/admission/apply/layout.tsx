import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ভর্তি আবেদন — আস-সুন্নাহ স্কিল",
    description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটে অনলাইনে ভর্তি আবেদন জমা দিন।",
    openGraph: { title: "ভর্তি আবেদন", description: "অনলাইনে ভর্তি আবেদন ফর্ম" },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
