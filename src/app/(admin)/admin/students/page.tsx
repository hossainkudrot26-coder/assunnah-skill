"use client";

import { useEffect, useState, useCallback } from "react";
import type { Enrollment, User, Course, Batch } from "@prisma/client";
import { getEnrollments, updateEnrollmentStatus } from "@/lib/actions/application";
import styles from "./students.module.css";

interface EnrollmentWithRelations extends Enrollment {
  user?: Pick<User, "name" | "email" | "phone">;
  course?: Pick<Course, "title">;
  batch?: { batchNumber: number } | null;
}

interface StudentRecord {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

const enrollmentLabels: Record<string, string> = {
  ENROLLED: "ভর্তি",
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

type ViewType = "students" | "enrollments";

export default function AdminStudents() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewType>("enrollments");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [studentsRes, enrollmentsData] = await Promise.all([
        fetch("/api/admin/students").then((r) => r.json()),
        getEnrollments(),
      ]);
      setStudents(studentsRes.students || []);
      setEnrollments(enrollmentsData);
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateEnrollmentStatus(id, status);
    if (result.success) {
      setMessage({ type: "success", text: "স্ট্যাটাস আপডেট হয়েছে" });
      await loadData();
    } else {
      setMessage({ type: "error", text: result.error || "সমস্যা হয়েছে" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.page}>
      {/* Toast */}
      {message && (
        <div className={`${styles.toast} ${message.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>শিক্ষার্থী ব্যবস্থাপনা</h2>
        </div>
      </div>

      {/* View Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn} ${view === "enrollments" ? styles.toggleBtnActive : ""}`}
          onClick={() => setView("enrollments")}
        >
          🎓 ভর্তি তালিকা ({enrollments.length})
        </button>
        <button
          className={`${styles.toggleBtn} ${view === "students" ? styles.toggleBtnActive : ""}`}
          onClick={() => setView("students")}
        >
          👤 সব শিক্ষার্থী ({students.length})
        </button>
      </div>

      {/* Enrollments View */}
      {view === "enrollments" && (
        <>
          {enrollments.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🎓</div>
              <p>কোনো ভর্তি রেকর্ড নেই</p>
            </div>
          ) : (
            <div className={styles.list}>
              {enrollments.map((enr) => (
                <div key={enr.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardName}>{enr.user?.name}</div>
                      <div className={styles.cardMeta}>
                        <span>📞 {enr.user?.phone || "—"}</span>
                        <span>✉ {enr.user?.email}</span>
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

                  <div className={styles.cardCourse}>
                    📚 {enr.course?.title}
                    {enr.batch && <span className={styles.batchBadge}>ব্যাচ #{enr.batch.batchNumber}</span>}
                  </div>

                  {/* Progress */}
                  <div className={styles.progressRow}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${enr.progress}%` }} />
                    </div>
                    <span className={styles.progressText}>{enr.progress}%</span>
                  </div>

                  <div className={styles.cardBottom}>
                    <span className={styles.cardDate}>ভর্তি: {formatDate(enr.enrolledAt)}</span>
                    <div className={styles.cardActions}>
                      {enr.status === "ENROLLED" && (
                        <button
                          className={`${styles.actionBtn} ${styles.progressBtn}`}
                          onClick={() => handleStatusChange(enr.id, "IN_PROGRESS")}
                        >
                          চলমান করুন
                        </button>
                      )}
                      {(enr.status === "ENROLLED" || enr.status === "IN_PROGRESS") && (
                        <>
                          <button
                            className={`${styles.actionBtn} ${styles.completeBtn}`}
                            onClick={() => handleStatusChange(enr.id, "COMPLETED")}
                          >
                            সম্পন্ন
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.dropBtn}`}
                            onClick={() => handleStatusChange(enr.id, "DROPPED")}
                          >
                            ড্রপ
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Students View */}
      {view === "students" && (
        <>
          {students.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>👤</div>
              <p>কোনো শিক্ষার্থী নেই</p>
            </div>
          ) : (
            <div className={styles.list}>
              {students.map((s) => (
                <div key={s.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardName}>{s.name}</div>
                      <div className={styles.cardMeta}>
                        <span>📞 {s.phone || "—"}</span>
                        <span>✉ {s.email}</span>
                      </div>
                    </div>
                    <span className={styles.cardDate}>{formatDate(s.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
