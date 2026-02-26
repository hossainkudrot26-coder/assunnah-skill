import { getPublishedCourses } from "@/lib/actions/data";
import { BookIcon } from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import CoursesListClient from "./CoursesListClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const dbCourses = await getPublishedCourses();

  // Map DB shape → client-safe serializable shape
  const courses = dbCourses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    titleEn: c.titleEn,
    shortDesc: c.shortDesc,
    duration: c.duration,
    type: c.type,
    category: c.category,
    iconName: c.iconName,
    color: c.color,
    fee: c.fee
      ? {
        admission: c.fee.admission,
        total: c.fee.total,
        scholarship: c.fee.scholarship,
      }
      : null,
    syllabus: c.syllabus.map((s) => ({
      title: s.title,
      topics: s.topics,
    })),
  }));

  return (
    <>
      <PageHeader
        title="কোর্স ক্যাটালগ"
        subtitle="ব্যবসা, প্রযুক্তি, কারিগরি — আপনার পছন্দের দক্ষতা অর্জন করুন"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "কোর্সসমূহ" },
        ]}
        badge={{ icon: <BookIcon size={14} color="var(--color-secondary-300)" />, text: "কোর্সসমূহ" }}
      />
      <CoursesListClient courses={courses} />
    </>
  );
}
