"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getUserEnrollments } from "@/lib/actions/application";
import styles from "./my-courses.module.css";

const enrollmentLabels: Record<string, string> = {
  ENROLLED: "ভর্তি হয়েছে",
  IN_PROGRESS: "চলমান",
  COMPLETED: "সম্পন্ন",
  DROPPED: "ছেড়ে দিয়েছে",
};

const enrollmentColors: Record<string, string> = {
  ENROLLED: "#1565C0",
  IN_PROGRESS: "#E65100",
  COMPLETED: "#1B8A50",
  DROPPED: "#DC2626",
};

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) { setLoading(false); return; }
    getUserEnrollments(session.user.id).then((data) => {
      setEnrollments(data);
      setLoading(false);
    });
  }, [session?.user?.id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });

  if (loading) return <p style={{ color: "var(--color-neutral-500)", padding: 20 }}>লোড হচ্ছে...</p>;

  if (enrollments.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-300)" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <h3>এখনো কোনো কোর্সে এনরোল হননি</h3>
          <p>আমাদের কোর্সসমূহ দেখুন এবং আবেদন করুন</p>
          <Link href="/courses" className={styles.browseBtn}>কোর্সসমূহ দেখুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.sectionTitle}>🎓 আমার কোর্সসমূহ ({enrollments.length})</h2>
      <div className={styles.list}>
        {enrollments.map((enr: any) => (
          <div key={enr.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <Link href={`/courses/${enr.course?.slug}`} className={styles.cardName}>
                  {enr.course?.title}
                </Link>
                <div className={styles.cardMeta}>
                  {enr.course?.duration} | {enr.course?.type}
                  {enr.batch && <span> | ব্যাচ #{enr.batch.batchNumber}</span>}
                </div>
              </div>
              <span
                className={styles.badge}
                style={{
                  background: `${enrollmentColors[enr.status]}15`,
                  color: enrollmentColors[enr.status],
                }}
              >
                {enrollmentLabels[enr.status]}
              </span>
            </div>

            {/* Progress */}
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${enr.progress}%` }} />
              </div>
              <span className={styles.progressText}>{enr.progress}% সম্পন্ন</span>
            </div>

            <div className={styles.cardDate}>
              ভর্তি: {formatDate(enr.enrolledAt)}
              {enr.completedAt && <> | সম্পন্ন: {formatDate(enr.completedAt)}</>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
