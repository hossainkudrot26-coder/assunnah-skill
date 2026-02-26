import { getPublishedCourses } from "@/lib/actions/data";
import { LayersIcon } from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import CompareClient from "./CompareClient";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const dbCourses = await getPublishedCourses();

  const courses = dbCourses.map((c) => ({
    slug: c.slug,
    title: c.title,
    duration: c.duration,
    type: c.type,
    category: c.category,
    iconName: c.iconName,
    color: c.color,
    outcomes: c.outcomes,
    feeAdmission: c.fee?.admission || "—",
    feeTotal: c.fee?.total || "—",
    feeScholarship: c.fee?.scholarship || "—",
    modulesCount: c.syllabus.length,
  }));

  return (
    <>
      <PageHeader
        title="কোর্স তুলনা"
        subtitle="পাশাপাশি কোর্স তুলনা করুন — সময়কাল, ফি, সিলেবাস ও সুবিধা"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "কোর্স তুলনা" },
        ]}
        badge={{ icon: <LayersIcon size={14} color="var(--color-secondary-300)" />, text: "কোর্স তুলনা" }}
      />
      <CompareClient courses={courses} />
    </>
  );
}
