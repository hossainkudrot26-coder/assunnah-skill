"use client";

import styles from "./not-found.module.css";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.background}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.pattern} />
      </div>
      <div className={styles.content}>
        <div className={styles.errorCode}>ত্রুটি</div>
        <h1 className={styles.title}>কিছু একটা সমস্যা হয়েছে</h1>
        <p className={styles.subtitle}>
          দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryBtn}>
            আবার চেষ্টা করুন
          </button>
          <Link href="/" className={styles.secondaryBtn}>
            হোমপেইজে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
