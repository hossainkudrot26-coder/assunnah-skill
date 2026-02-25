"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/data";
import styles from "./admin-dashboard.module.css";

interface Stats {
  totalStudents: number;
  totalApplications: number;
  pendingApplications: number;
  totalCourses: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const statCards = [
    { label: "মোট শিক্ষার্থী", value: stats?.totalStudents ?? "—", color: "#1B8A50", href: "/admin/students" },
    { label: "মোট আবেদন", value: stats?.totalApplications ?? "—", color: "#1565C0", href: "/admin/applications" },
    { label: "পেন্ডিং আবেদন", value: stats?.pendingApplications ?? "—", color: "#E65100", href: "/admin/applications" },
    { label: "সক্রিয় কোর্স", value: stats?.totalCourses ?? "—", color: "#9C27B0", href: "/admin/courses" },
    { label: "মোট মেসেজ", value: stats?.totalMessages ?? "—", color: "#2E7D32", href: "/admin/messages" },
    { label: "অপঠিত মেসেজ", value: stats?.unreadMessages ?? "—", color: "#D4A843", href: "/admin/messages" },
  ];

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.welcomeBanner}>
        <h2>অ্যাডমিন প্যানেল</h2>
        <p>প্রতিষ্ঠানের সকল কার্যক্রম এখান থেকে পরিচালনা করুন</p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className={styles.statCard}>
            <div className={styles.statDot} style={{ background: card.color }} />
            <div>
              <span className={styles.statValue}>{card.value}</span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>দ্রুত অ্যাকশন</h3>
      <div className={styles.quickGrid}>
        {[
          { label: "আবেদন দেখুন", href: "/admin/applications", icon: "📋" },
          { label: "মেসেজ পড়ুন", href: "/admin/messages", icon: "💬" },
          { label: "কোর্স ম্যানেজ", href: "/admin/courses", icon: "📚" },
          { label: "ব্লগ লিখুন", href: "/admin/blog", icon: "✏️" },
          { label: "গ্যালারি", href: "/admin/gallery", icon: "🖼️" },
          { label: "শিক্ষার্থী", href: "/admin/students", icon: "🎓" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className={styles.quickCard}>
            <span className={styles.quickIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
