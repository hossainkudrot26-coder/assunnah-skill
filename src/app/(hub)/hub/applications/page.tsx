"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getUserApplications, getUserEnrollments } from "@/lib/actions/application";
import styles from "./my-applications.module.css";

const statusLabels: Record<string, string> = {
  PENDING: "পেন্ডিং",
  UNDER_REVIEW: "পর্যালোচনা চলছে",
  INTERVIEW_SCHEDULED: "ইন্টারভিউ নির্ধারিত",
  ACCEPTED: "গৃহীত",
  REJECTED: "বাতিল",
};

const statusColors: Record<string, string> = {
  PENDING: "#E65100",
  UNDER_REVIEW: "#1565C0",
  INTERVIEW_SCHEDULED: "#7B1FA2",
  ACCEPTED: "#1B8A50",
  REJECTED: "#DC2626",
};

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

export default function MyApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) { setLoading(false); return; }

    Promise.all([
      getUserApplications(session.user.id),
      getUserEnrollments(session.user.id),
    ]).then(([apps, enr]) => {
      setApplications(apps);
      setEnrollments(enr);
      setLoading(false);
    });
  }, [session?.user?.id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p style={{ color: "var(--color-neutral-500)", padding: "20px" }}>লোড হচ্ছে...</p>;

  if (!session?.user) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h3>লগইন করুন</h3>
          <p>আপনার আবেদনগুলো দেখতে প্রথমে লগইন করুন</p>
          <Link href="/login" className={styles.browseBtn}>লগইন</Link>
        </div>
      </div>
    );
  }

  const hasData = applications.length > 0 || enrollments.length > 0;

  return (
    <div className={styles.page}>
      {/* Enrollments */}
      {enrollments.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎓 আমার ভর্তি</h2>
          <div className={styles.list}>
            {enrollments.map((enr) => (
              <div key={enr.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.cardName}>{enr.course?.title}</div>
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

                {/* Progress bar */}
                {(enr.status === "ENROLLED" || enr.status === "IN_PROGRESS") && (
                  <div className={styles.progressWrap}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${enr.progress}%` }} />
                    </div>
                    <span className={styles.progressText}>{enr.progress}% সম্পন্ন</span>
                  </div>
                )}

                <div className={styles.cardDate}>
                  ভর্তির তারিখ: {formatDate(enr.enrolledAt)}
                  {enr.completedAt && <> | সম্পন্ন: {formatDate(enr.completedAt)}</>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Applications */}
      {applications.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📋 আমার আবেদনসমূহ</h2>
          <div className={styles.list}>
            {applications.map((app) => (
              <div key={app.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.cardName}>{app.course?.title}</div>
                    <div className={styles.cardMeta}>
                      {app.course?.duration} | {app.course?.type}
                    </div>
                  </div>
                  <span
                    className={styles.badge}
                    style={{
                      background: `${statusColors[app.status]}15`,
                      color: statusColors[app.status],
                    }}
                  >
                    {statusLabels[app.status]}
                  </span>
                </div>

                {/* Status timeline */}
                <div className={styles.timeline}>
                  {["PENDING", "UNDER_REVIEW", "ACCEPTED"].map((step, i) => {
                    const steps = ["PENDING", "UNDER_REVIEW", "ACCEPTED"];
                    const currentIdx = steps.indexOf(app.status);
                    const isCompleted = app.status === "REJECTED" ? false : i <= currentIdx;
                    const isRejected = app.status === "REJECTED";
                    return (
                      <div
                        key={step}
                        className={`${styles.timelineStep} ${isCompleted ? styles.timelineCompleted : ""} ${isRejected && i === 0 ? styles.timelineRejected : ""}`}
                      >
                        <div className={styles.timelineDot} />
                        <span>{statusLabels[step]}</span>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.cardDate}>
                  আবেদনের তারিখ: {formatDate(app.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!hasData && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-300)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3>এখনো কোনো আবেদন করা হয়নি</h3>
          <p>ভর্তির জন্য আবেদন করতে নিচের বাটনে ক্লিক করুন</p>
          <Link href="/admission/apply" className={styles.browseBtn}>আবেদন করুন</Link>
        </div>
      )}
    </div>
  );
}
