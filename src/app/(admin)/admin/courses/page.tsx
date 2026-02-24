"use client";

import { useEffect, useState } from "react";
import { getPublishedCourses } from "@/lib/actions/data";
import styles from "../messages/messages.module.css";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedCourses().then((data) => { setCourses(data); setLoading(false); });
  }, []);

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.messagesPage}>
      <div className={styles.header}>
        <h2>কোর্সসমূহ</h2>
        <span className={styles.count}>{courses.length} টি কোর্স</span>
      </div>
      <div className={styles.messagesList}>
        {courses.map((c: any) => (
          <div key={c.id} className={styles.messageCard}>
            <div className={styles.messageTop}>
              <div>
                <strong>{c.title}</strong>
                <span className={styles.phone}>{c.duration} | {c.type}</span>
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px", borderRadius: "6px", background: "#F0FDF4", color: "#16A34A" }}>
                {c.status === "PUBLISHED" ? "প্রকাশিত" : "ড্রাফট"}
              </span>
            </div>
            <p className={styles.messageBody}>{c.shortDesc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
