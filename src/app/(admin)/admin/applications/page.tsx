"use client";

import { useEffect, useState } from "react";
import { getApplications, updateApplicationStatus } from "@/lib/actions/application";
import styles from "../messages/messages.module.css";

const statusLabels: Record<string, string> = {
  PENDING: "পেন্ডিং",
  UNDER_REVIEW: "পর্যালোচনা চলছে",
  ACCEPTED: "গৃহীত",
  REJECTED: "বাতিল",
  WAITLISTED: "ওয়েটলিস্ট",
};

const statusColors: Record<string, string> = {
  PENDING: "#E65100",
  UNDER_REVIEW: "#1565C0",
  ACCEPTED: "#1B8A50",
  REJECTED: "#DC2626",
  WAITLISTED: "#9C27B0",
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications(undefined, 1, 50).then((data) => {
      setApplications(data.applications);
      setLoading(false);
    });
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    await updateApplicationStatus(id, newStatus);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.messagesPage}>
      <div className={styles.header}>
        <h2>ভর্তি আবেদনসমূহ</h2>
        <span className={styles.count}>{applications.length} টি আবেদন</span>
      </div>

      {applications.length === 0 ? (
        <div className={styles.empty}>
          <p>কোনো আবেদন নেই</p>
        </div>
      ) : (
        <div className={styles.messagesList}>
          {applications.map((app) => (
            <div key={app.id} className={styles.messageCard}>
              <div className={styles.messageTop}>
                <div>
                  <strong>{app.applicantName}</strong>
                  <span className={styles.phone}>{app.applicantPhone}</span>
                </div>
                <div className={styles.messageActions}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "6px",
                      background: `${statusColors[app.status]}15`,
                      color: statusColors[app.status],
                    }}
                  >
                    {statusLabels[app.status]}
                  </span>
                </div>
              </div>
              <span className={styles.subject}>{app.course?.title}</span>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {app.status === "PENDING" && (
                  <>
                    <button
                      className={styles.markReadBtn}
                      onClick={() => handleStatusChange(app.id, "ACCEPTED")}
                      style={{ background: "#F0FDF4", color: "#16A34A", borderColor: "#BBF7D0" }}
                    >
                      গ্রহণ করুন
                    </button>
                    <button
                      className={styles.markReadBtn}
                      onClick={() => handleStatusChange(app.id, "REJECTED")}
                      style={{ background: "#FEF2F2", color: "#DC2626", borderColor: "#FECACA" }}
                    >
                      বাতিল করুন
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
