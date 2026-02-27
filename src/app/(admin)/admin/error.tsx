"use client";

import Link from "next/link";
import styles from "./error.module.css";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h2 className={styles.errorTitle}>সমস্যা হয়েছে</h2>
      <p className={styles.errorMessage}>
        এই পেজে একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।
      </p>
      {process.env.NODE_ENV === "development" && error?.message && (
        <div className={styles.errorDetails}>{error.message}</div>
      )}
      <div className={styles.errorActions}>
        <button onClick={reset} className={styles.retryBtn}>
          আবার চেষ্টা
        </button>
        <Link href="/admin" className={styles.dashboardLink}>
          ড্যাশবোর্ড
        </Link>
      </div>
    </div>
  );
}
