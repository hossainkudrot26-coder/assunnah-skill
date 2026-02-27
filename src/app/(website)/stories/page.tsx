import type { Metadata } from "next";
import { getPublicTestimonials } from "@/lib/actions/testimonial";
import StoriesClient from "./StoriesClient";

export const metadata: Metadata = {
  title: "সাফল্যের গল্প",
  description:
    "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের শিক্ষার্থীদের জীবন বদলের সাক্ষী গল্পসমূহ",
};

export default async function StoriesPage() {
  const testimonials = await getPublicTestimonials();

  // Map DB testimonials to the Stories page display format
  const stories = testimonials.map((t) => ({
    name: t.name,
    initials: t.initials || t.name.split(" ").map((w) => w.charAt(0)).join("").slice(0, 2),
    batch: t.batch,
    course: t.course || t.batch.split("—")[0]?.trim() || "সাধারণ",
    story: t.story,
    achievement: t.achievement,
    currentRole: t.currentRole || t.achievement,
    monthlyIncome: t.monthlyIncome || "",
    color: t.color,
    rating: t.rating,
  }));

  return <StoriesClient stories={stories} />;
}
