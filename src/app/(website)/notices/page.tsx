import { getPublishedNotices } from "@/lib/actions/notice";
import NoticesClient from "./NoticesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "নোটিশ বোর্ড — আস-সুন্নাহ স্কিল",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের সকল ভর্তি, পরীক্ষা ও ফলাফল বিষয়ক নোটিশ।",
  openGraph: { title: "নোটিশ বোর্ড", description: "ভর্তি, পরীক্ষা ও ফলাফল সংক্রান্ত নোটিশ" },
};

export default async function NoticesPage() {
  const notices = await getPublishedNotices();

  // Serialize dates for client component
  const serialized = notices.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    type: n.type,
    isImportant: n.isImportant,
    link: n.link,
    publishedAt: n.publishedAt.toISOString(),
  }));

  return <NoticesClient notices={serialized} />;
}
