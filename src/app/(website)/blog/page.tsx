import Link from "next/link";
import type { Metadata } from "next";
import { MegaphoneIcon, ArrowRightIcon } from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";

export const metadata: Metadata = {
  title: "ব্লগ / সংবাদ",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের সাম্প্রতিক খবর ও আপডেট",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        badge="ব্লগ / সংবাদ"
        badgeIcon={<MegaphoneIcon size={14} color="var(--color-secondary-400)" />}
        title="ব্লগ /"
        titleHighlight="সংবাদ"
        subtitle="সাম্প্রতিক খবর, আপডেট ও প্রশিক্ষণ সংক্রান্ত তথ্য"
        breadcrumbs={[{ label: "ব্লগ / সংবাদ" }]}
      />

      <section className="section" style={{ textAlign: "center" }}>
        <div className="container">
          <div style={{
            maxWidth: "500px",
            margin: "0 auto",
            padding: "var(--space-12)",
            background: "var(--color-neutral-50)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid var(--color-neutral-200)",
          }}>
            <MegaphoneIcon size={48} color="var(--color-neutral-300)" />
            <h2 style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 700,
              marginTop: "var(--space-6)",
              marginBottom: "var(--space-3)",
            }}>
              শীঘ্রই আসছে
            </h2>
            <p style={{
              color: "var(--color-neutral-600)",
              marginBottom: "var(--space-8)",
            }}>
              আমাদের ব্লগ সেকশন প্রস্তুত হচ্ছে। প্রশিক্ষণ সংক্রান্ত আর্টিকেল, সংবাদ ও আপডেট শীঘ্রই পাওয়া যাবে।
            </p>
            <Link href="/" className="btn btn-primary">
              <ArrowRightIcon size={15} color="white" />
              মূল পাতায় ফিরে যান
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
