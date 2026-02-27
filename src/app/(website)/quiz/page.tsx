import { getPublishedCourses } from "@/lib/actions/data";
import { SparkleIcon } from "@/shared/components/Icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "কোর্স কুইজ — আস-সুন্নাহ স্কিল",
  description: "কুইজ দিয়ে জানুন কোন কোর্সটি আপনার জন্য সবচেয়ে উপযুক্ত।",
  openGraph: { title: "কোর্স কুইজ", description: "আপনার জন্য সঠিক কোর্স খুঁজুন" },
};
import { PageHeader } from "@/shared/components/PageHeader";
import QuizClient from "./QuizClient";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const dbCourses = await getPublishedCourses();

  const courses = dbCourses.map((c) => ({
    slug: c.slug,
    title: c.title,
    shortDesc: c.shortDesc,
    duration: c.duration,
    type: c.type,
    category: c.category,
    iconName: c.iconName,
    color: c.color,
    feeTotal: c.fee?.total || "—",
    feeScholarship: c.fee?.scholarship || "—",
  }));

  return (
    <>
      <PageHeader
        title="কোর্স ফাইন্ডার"
        subtitle="কয়েকটি সহজ প্রশ্নের উত্তর দিন — আমরা আপনার জন্য সেরা কোর্স খুঁজে দেবো"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "কোর্স ফাইন্ডার" },
        ]}
        badge={{ icon: <SparkleIcon size={14} color="var(--color-secondary-300)" />, text: "কোর্স ফাইন্ডার" }}
      />
      <QuizClient courses={courses} />
    </>
  );
}
