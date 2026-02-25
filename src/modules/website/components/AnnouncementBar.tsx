"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./AnnouncementBar.module.css";

interface Announcement {
  id: string;
  text: string;
  link?: string;
  linkText?: string;
  type?: "info" | "urgent" | "success";
}

const announcements: Announcement[] = [
  {
    id: "1",
    text: "নতুন ব্যাচের ভর্তি চলছে!",
    link: "/admission/apply",
    linkText: "এখনই আবেদন করুন",
    type: "urgent",
  },
  {
    id: "2",
    text: "শেফ ট্রেনিং কোর্সে ১০০% ফ্রি প্রশিক্ষণ",
    link: "/courses/chef-training",
    linkText: "বিস্তারিত দেখুন",
    type: "success",
  },
  {
    id: "3",
    text: "NSDA নিবন্ধিত সার্টিফিকেট — সরকারি স্বীকৃতিসহ",
    link: "/about",
    linkText: "আরো জানুন",
    type: "info",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className={`${styles.bar} ${styles[current.type || "info"]}`}>
      <div className={styles.inner}>
        <div className={styles.pulseIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className={`${styles.textWrap} ${isAnimating ? styles.slideOut : styles.slideIn}`}>
          <span className={styles.text}>{current.text}</span>
          {current.link && (
            <Link href={current.link} className={styles.link}>
              {current.linkText || "বিস্তারিত"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        {announcements.length > 1 && (
          <div className={styles.dots}>
            {announcements.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ""}`}
                onClick={() => { setIsAnimating(true); setTimeout(() => { setCurrentIndex(i); setIsAnimating(false); }, 300); }}
                aria-label={`বিজ্ঞপ্তি ${i + 1}`}
              />
            ))}
          </div>
        )}
        <button className={styles.close} onClick={() => setIsVisible(false)} aria-label="বন্ধ করুন">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
