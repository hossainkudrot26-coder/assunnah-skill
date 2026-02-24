"use client";

import Link from "next/link";
import styles from "./my-courses.module.css";

export default function MyCoursesPage() {
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
        <Link href="/courses" className={styles.browseBtn}>
          কোর্সসমূহ দেখুন
        </Link>
      </div>
    </div>
  );
}
