import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourseBySlug, getPublishedCourses } from "@/lib/actions/data";
import CourseDetailClient from "./CourseDetailClient";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "কোর্স পাওয়া যায়নি" };
  const desc = `${course.title} — আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের কোর্সের বিস্তারিত তথ্য, ফি, সিলেবাস ও ব্যাচ সময়সূচী।`;
  return {
    title: `${course.title} — আস-সুন্নাহ স্কিল`,
    description: desc,
    openGraph: { title: course.title, description: desc },
  };
}

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Get related courses (exclude current, limit 3)
  const allCourses = await getPublishedCourses();
  const relatedCourses = allCourses
    .filter((c) => c.slug !== slug)
    .slice(0, 3)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      shortDesc: c.shortDesc,
      duration: c.duration,
      iconName: c.iconName,
      color: c.color,
    }));

  // Serialize for client
  const courseData = {
    slug: course.slug,
    title: course.title,
    titleEn: course.titleEn,
    shortDesc: course.shortDesc,
    fullDesc: course.fullDesc,
    duration: course.duration,
    type: course.type,
    category: course.category,
    iconName: course.iconName,
    color: course.color,
    image: course.image,
    batchInfo: course.batchInfo,
    requirements: course.requirements,
    outcomes: course.outcomes,
    videoPreviewUrl: course.videoPreviewUrl,
    fee: course.fee
      ? {
        admission: course.fee.admission,
        total: course.fee.total,
        scholarship: course.fee.scholarship,
      }
      : null,
    syllabus: course.syllabus.map((s) => ({
      title: s.title,
      topics: s.topics,
    })),
    instructors: course.instructors.map((inst) => ({
      name: inst.name,
      role: inst.role,
      bio: inst.bio,
      initials: inst.initials,
    })),
    faqs: course.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    batches: course.batches.map((b) => ({
      batchNumber: b.batchNumber,
      startDate: b.startDate ? b.startDate.toISOString() : null,
      endDate: b.endDate ? b.endDate.toISOString() : null,
      capacity: b.capacity,
      status: b.status,
    })),
  };

  return <CourseDetailClient course={courseData} relatedCourses={relatedCourses} />;
}
