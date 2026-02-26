"use client";

import { useEffect, useState, useCallback } from "react";
import { getApplications, updateApplicationStatus, enrollStudent, getApplicationDetail } from "@/lib/actions/application";
import styles from "./applications.module.css";

/* ═══════════════════════════════════════════
   STATUS CONFIG
   ═══════════════════════════════════════════ */

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

type FilterType = "ALL" | "PENDING" | "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "ACCEPTED" | "REJECTED";

/* ═══════════════════════════════════════════
   ADMIN APPLICATIONS PAGE
   ═══════════════════════════════════════════ */

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [detail, setDetail] = useState<any>(null);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadApplications = useCallback(async () => {
    const filterStatus = filter === "ALL" ? undefined : filter;
    const data = await getApplications(filterStatus, 1, 100);
    setApplications(data.applications);
    setTotal(data.total);
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  // Status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateApplicationStatus(id, newStatus);
    if (result.success) {
      await loadApplications();
      setMessage({ type: "success", text: "স্ট্যাটাস আপডেট হয়েছে" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // View detail
  const viewDetail = async (id: string) => {
    const app = await getApplicationDetail(id);
    setDetail(app);
  };

  // Enroll student
  const handleEnroll = async (applicationId: string) => {
    setEnrolling(applicationId);
    const result = await enrollStudent(applicationId);
    if (result.success) {
      setMessage({ type: "success", text: result.message || "ভর্তি সম্পন্ন!" });
      setDetail(null);
      await loadApplications();
    } else {
      setMessage({ type: "error", text: result.error || "সমস্যা হয়েছে" });
    }
    setEnrolling(null);
    // Keep credentials visible longer so admin can copy
    const hasCredentials = result.success && result.message?.includes("পাসওয়ার্ড");
    setTimeout(() => setMessage(null), hasCredentials ? 15000 : 4000);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.page}>
      {/* Toast */}
      {message && (
        <div
          className={`${styles.toast} ${message.type === "error" ? styles.toastError : styles.toastSuccess}`}
          style={{ whiteSpace: "pre-line" }}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>ভর্তি আবেদনসমূহ</h2>
          <span className={styles.count}>{total} টি আবেদন</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className={styles.filters}>
        {(["ALL", "PENDING", "UNDER_REVIEW", "INTERVIEW_SCHEDULED", "ACCEPTED", "REJECTED"] as FilterType[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => { setFilter(f); setLoading(true); }}
          >
            {f === "ALL" ? "সব" : statusLabels[f]}
          </button>
        ))}
      </div>

      {/* Application List */}
      {applications.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <p>কোনো আবেদন পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className={styles.list}>
          {applications.map((app) => (
            <div key={app.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{app.applicantName}</div>
                  <div className={styles.cardMeta}>
                    <span>📞 {app.applicantPhone}</span>
                    {app.applicantEmail && <span>✉ {app.applicantEmail}</span>}
                  </div>
                </div>
                <div className={styles.cardBadges}>
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
              </div>

              <div className={styles.cardCourse}>
                📚 {app.course?.title}
              </div>

              <div className={styles.cardBottom}>
                <span className={styles.cardDate}>{formatDate(app.createdAt)}</span>

                <div className={styles.cardActions}>
                  <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={() => viewDetail(app.id)}>
                    বিস্তারিত
                  </button>

                  {app.status === "PENDING" && (
                    <>
                      <button
                        className={`${styles.actionBtn} ${styles.reviewBtn}`}
                        onClick={() => handleStatusChange(app.id, "UNDER_REVIEW")}
                      >
                        পর্যালোচনা
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.acceptBtn}`}
                        onClick={() => handleStatusChange(app.id, "ACCEPTED")}
                      >
                        গ্রহণ
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.rejectBtn}`}
                        onClick={() => handleStatusChange(app.id, "REJECTED")}
                      >
                        বাতিল
                      </button>
                    </>
                  )}

                  {app.status === "UNDER_REVIEW" && (
                    <>
                      <button
                        className={`${styles.actionBtn} ${styles.acceptBtn}`}
                        onClick={() => handleStatusChange(app.id, "ACCEPTED")}
                      >
                        গ্রহণ
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.rejectBtn}`}
                        onClick={() => handleStatusChange(app.id, "REJECTED")}
                      >
                        বাতিল
                      </button>
                    </>
                  )}

                  {app.status === "ACCEPTED" && (
                    <button
                      className={`${styles.actionBtn} ${styles.enrollBtn}`}
                      onClick={() => handleEnroll(app.id)}
                      disabled={enrolling === app.id}
                    >
                      {enrolling === app.id ? "ভর্তি হচ্ছে..." : "🎓 ভর্তি করুন"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className={styles.modalOverlay} onClick={() => setDetail(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>আবেদনের বিস্তারিত</h3>
              <button className={styles.closeBtn} onClick={() => setDetail(null)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>নাম</label>
                  <span>{detail.applicantName}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>ফোন</label>
                  <span>{detail.applicantPhone}</span>
                </div>
                {detail.applicantEmail && (
                  <div className={styles.detailItem}>
                    <label>ইমেইল</label>
                    <span>{detail.applicantEmail}</span>
                  </div>
                )}
                {detail.fatherName && (
                  <div className={styles.detailItem}>
                    <label>পিতার নাম</label>
                    <span>{detail.fatherName}</span>
                  </div>
                )}
                {detail.motherName && (
                  <div className={styles.detailItem}>
                    <label>মাতার নাম</label>
                    <span>{detail.motherName}</span>
                  </div>
                )}
                {detail.dateOfBirth && (
                  <div className={styles.detailItem}>
                    <label>জন্ম তারিখ</label>
                    <span>{formatDate(detail.dateOfBirth)}</span>
                  </div>
                )}
                {detail.gender && (
                  <div className={styles.detailItem}>
                    <label>লিঙ্গ</label>
                    <span>{detail.gender === "MALE" ? "পুরুষ" : "নারী"}</span>
                  </div>
                )}
                {detail.nidNumber && (
                  <div className={styles.detailItem}>
                    <label>NID</label>
                    <span>{detail.nidNumber}</span>
                  </div>
                )}
                {detail.address && (
                  <div className={`${styles.detailItem} ${styles.detailFull}`}>
                    <label>ঠিকানা</label>
                    <span>{detail.address}</span>
                  </div>
                )}
                {detail.education && (
                  <div className={styles.detailItem}>
                    <label>শিক্ষাগত যোগ্যতা</label>
                    <span>{detail.education}</span>
                  </div>
                )}
                {detail.experience && (
                  <div className={styles.detailItem}>
                    <label>অভিজ্ঞতা</label>
                    <span>{detail.experience}</span>
                  </div>
                )}
                {detail.motivation && (
                  <div className={`${styles.detailItem} ${styles.detailFull}`}>
                    <label>আবেদনের কারণ</label>
                    <span>{detail.motivation}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <label>কোর্স</label>
                  <span>{detail.course?.title}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>স্ট্যাটাস</label>
                  <span style={{ color: statusColors[detail.status], fontWeight: 600 }}>
                    {statusLabels[detail.status]}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>আবেদনের তারিখ</label>
                  <span>{formatDate(detail.createdAt)}</span>
                </div>
                {detail.reviewNotes && (
                  <div className={`${styles.detailItem} ${styles.detailFull}`}>
                    <label>পর্যালোচনা নোট</label>
                    <span>{detail.reviewNotes}</span>
                  </div>
                )}
              </div>

              {/* Action buttons in modal */}
              <div className={styles.modalActions}>
                {detail.status === "PENDING" && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.reviewBtn}`}
                      onClick={() => { handleStatusChange(detail.id, "UNDER_REVIEW"); setDetail(null); }}
                    >
                      পর্যালোচনায় নিন
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.acceptBtn}`}
                      onClick={() => { handleStatusChange(detail.id, "ACCEPTED"); setDetail(null); }}
                    >
                      গ্রহণ করুন
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.rejectBtn}`}
                      onClick={() => { handleStatusChange(detail.id, "REJECTED"); setDetail(null); }}
                    >
                      বাতিল করুন
                    </button>
                  </>
                )}
                {detail.status === "UNDER_REVIEW" && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.acceptBtn}`}
                      onClick={() => { handleStatusChange(detail.id, "ACCEPTED"); setDetail(null); }}
                    >
                      গ্রহণ করুন
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.rejectBtn}`}
                      onClick={() => { handleStatusChange(detail.id, "REJECTED"); setDetail(null); }}
                    >
                      বাতিল করুন
                    </button>
                  </>
                )}
                {detail.status === "ACCEPTED" && (
                  <button
                    className={`${styles.actionBtn} ${styles.enrollBtn}`}
                    onClick={() => handleEnroll(detail.id)}
                    disabled={enrolling === detail.id}
                  >
                    {enrolling === detail.id ? "ভর্তি হচ্ছে..." : "🎓 ভর্তি করুন"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
