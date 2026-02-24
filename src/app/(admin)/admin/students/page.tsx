"use client";

import { useEffect, useState } from "react";
import prisma from "@/lib/db";
import styles from "../messages/messages.module.css";

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.messagesPage}>
      <div className={styles.header}>
        <h2>শিক্ষার্থী তালিকা</h2>
        <span className={styles.count}>{students.length} জন</span>
      </div>

      {students.length === 0 ? (
        <div className={styles.empty}>
          <p>কোনো শিক্ষার্থী নেই</p>
        </div>
      ) : (
        <div className={styles.messagesList}>
          {students.map((s: any) => (
            <div key={s.id} className={styles.messageCard}>
              <div className={styles.messageTop}>
                <div>
                  <strong>{s.name}</strong>
                  <span className={styles.phone}>{s.phone || "—"}</span>
                  <span className={styles.email}>{s.email}</span>
                </div>
                <span className={styles.date}>
                  {new Date(s.createdAt).toLocaleDateString("bn-BD")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
