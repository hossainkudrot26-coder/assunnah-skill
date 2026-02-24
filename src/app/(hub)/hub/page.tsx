"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./dashboard.module.css";

const quickActions = [
  {
    label: "নতুন আবেদন",
    href: "/admission",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    color: "#1B8A50",
  },
  {
    label: "কোর্স দেখুন",
    href: "/courses",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    color: "#1565C0",
  },
  {
    label: "প্রোফাইল",
    href: "/hub/profile",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: "#9C27B0",
  },
  {
    label: "যোগাযোগ",
    href: "/contact",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    color: "#E65100",
  },
];

export default function HubDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "শিক্ষার্থী";

  return (
    <div className={styles.dashboard}>
      {/* Welcome */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <h2>আসসালামু আলাইকুম, {userName}!</h2>
          <p>আপনার ড্যাশবোর্ডে স্বাগতম। এখান থেকে আপনার কোর্স, আবেদন ও প্রোফাইল পরিচালনা করুন।</p>
        </div>
        <div className={styles.welcomeDecor}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" opacity="0.15">
            <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="2" />
            <circle cx="60" cy="60" r="35" stroke="white" strokeWidth="2" />
            <circle cx="60" cy="60" r="20" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className={styles.sectionTitle}>দ্রুত অ্যাকশন</h3>
      <div className={styles.actionsGrid}>
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className={styles.actionCard}>
            <div className={styles.actionIcon} style={{ background: `${action.color}15`, color: action.color }}>
              {action.icon}
            </div>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Info Cards */}
      <h3 className={styles.sectionTitle}>আপনার অবস্থা</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(27,138,80,0.1)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B8A50" strokeWidth="1.8">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <div>
            <span className={styles.statValue}>০</span>
            <span className={styles.statLabel}>এনরোল করা কোর্স</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(21,101,192,0.1)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </div>
          <div>
            <span className={styles.statValue}>০</span>
            <span className={styles.statLabel}>মোট আবেদন</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(212,168,67,0.1)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.8">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
            </svg>
          </div>
          <div>
            <span className={styles.statValue}>—</span>
            <span className={styles.statLabel}>সনদপত্র</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className={styles.noticeCard}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-500)" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <strong>নোটিশ</strong>
          <p>ব্যাচ ১৬-তে ভর্তি চলছে! আগ্রহী হলে এখনই আবেদন করুন — আসন সীমিত।</p>
        </div>
      </div>
    </div>
  );
}
