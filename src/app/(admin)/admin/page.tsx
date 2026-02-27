"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/data";
import styles from "./admin-dashboard.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface RecentApplication {
  id: string;
  applicantName: string;
  status: string;
  createdAt: Date;
  course: { title: string };
}

interface RecentMessage {
  id: string;
  name: string;
  subject: string;
  status: string;
  createdAt: Date;
}

interface ActiveBatch {
  id: string;
  batchNumber: number;
  status: string;
  startDate: Date | null;
  course: { title: string };
  _count: { enrollments: number };
}

interface DashboardData {
  totalStudents: number;
  totalApplications: number;
  pendingApplications: number;
  totalCourses: number;
  totalMessages: number;
  unreadMessages: number;
  totalEnrollments: number;
  totalBlogPosts: number;
  recentApplications: RecentApplication[];
  recentMessages: RecentMessage[];
  activeBatches: ActiveBatch[];
}

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

const statusBadge: Record<string, { label: string; className: string }> = {
  PENDING: { label: "অপেক্ষমান", className: "badgeWarning" },
  APPROVED: { label: "অনুমোদিত", className: "badgeSuccess" },
  REJECTED: { label: "প্রত্যাখ্যাত", className: "badgeDanger" },
  UNREAD: { label: "অপঠিত", className: "badgeInfo" },
  READ: { label: "পঠিত", className: "badgeNeutral" },
  REPLIED: { label: "উত্তর দেওয়া", className: "badgeSuccess" },
  UPCOMING: { label: "আসন্ন", className: "badgeInfo" },
  ONGOING: { label: "চলমান", className: "badgeSuccess" },
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}

function getBadgeClass(status: string): string {
  return styles[statusBadge[status]?.className ?? "badgeNeutral"];
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardStats().then((d) => setData(d as DashboardData));
  }, []);

  const statCards = [
    { label: "মোট শিক্ষার্থী", value: data?.totalStudents ?? "—", color: "#1B8A50", href: "/admin/students" },
    { label: "মোট আবেদন", value: data?.totalApplications ?? "—", color: "#1565C0", href: "/admin/applications" },
    { label: "পেন্ডিং আবেদন", value: data?.pendingApplications ?? "—", color: "#E65100", href: "/admin/applications" },
    { label: "সক্রিয় কোর্স", value: data?.totalCourses ?? "—", color: "#9C27B0", href: "/admin/courses" },
    { label: "এনরোলমেন্ট", value: data?.totalEnrollments ?? "—", color: "#00838F", href: "/admin/enrollments" },
    { label: "অপঠিত মেসেজ", value: data?.unreadMessages ?? "—", color: "#D4A843", href: "/admin/messages" },
    { label: "মোট মেসেজ", value: data?.totalMessages ?? "—", color: "#2E7D32", href: "/admin/messages" },
    { label: "ব্লগ পোস্ট", value: data?.totalBlogPosts ?? "—", color: "#5E35B1", href: "/admin/blog" },
  ];

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.welcomeBanner}>
        <h2>অ্যাডমিন প্যানেল</h2>
        <p>প্রতিষ্ঠানের সকল কার্যক্রম এখান থেকে পরিচালনা করুন</p>
      </div>

      {/* Stats Grid */}
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

      {/* Two Column: Recent Activity */}
      <div className={styles.twoCol}>
        {/* Recent Applications */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionHeaderTitle}>সাম্প্রতিক আবেদন</h3>
            <Link href="/admin/applications" className={styles.sectionHeaderLink}>সব দেখুন →</Link>
          </div>
          {data?.recentApplications.length === 0 && (
            <p className={styles.emptyStateCompact}>কোনো আবেদন নেই</p>
          )}
          {data?.recentApplications.map((app) => (
            <div key={app.id} className={styles.feedItem}>
              <div>
                <div className={styles.feedName}>{app.applicantName}</div>
                <div className={styles.feedMeta}>{app.course.title} · {formatDate(app.createdAt)}</div>
              </div>
              <span className={`${styles.badge} ${getBadgeClass(app.status)}`}>
                {statusBadge[app.status]?.label ?? app.status}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Messages */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionHeaderTitle}>সাম্প্রতিক মেসেজ</h3>
            <Link href="/admin/messages" className={styles.sectionHeaderLink}>সব দেখুন →</Link>
          </div>
          {data?.recentMessages.length === 0 && (
            <p className={styles.emptyStateCompact}>কোনো মেসেজ নেই</p>
          )}
          {data?.recentMessages.map((msg) => (
            <div key={msg.id} className={styles.feedItem}>
              <div>
                <div className={styles.feedName}>{msg.name}</div>
                <div className={styles.feedMeta}>{msg.subject} · {formatDate(msg.createdAt)}</div>
              </div>
              <span className={`${styles.badge} ${getBadgeClass(msg.status)}`}>
                {statusBadge[msg.status]?.label ?? msg.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Batches */}
      {data && data.activeBatches.length > 0 && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionHeaderTitle}>সক্রিয় ব্যাচসমূহ</h3>
            <Link href="/admin/courses" className={styles.sectionHeaderLink}>কোর্স দেখুন →</Link>
          </div>
          <div className={styles.batchGrid}>
            {data.activeBatches.map((batch) => (
              <div key={batch.id} className={styles.batchCard}>
                <div className={styles.batchTitle}>ব্যাচ {batch.batchNumber}</div>
                <div className={styles.batchCourse}>{batch.course.title}</div>
                <div className={styles.batchFooter}>
                  <span className={styles.batchCount}>{batch._count.enrollments} জন ভর্তি</span>
                  <span className={`${styles.badge} ${getBadgeClass(batch.status)}`}>
                    {statusBadge[batch.status]?.label ?? batch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h3 className={styles.sectionTitle}>দ্রুত অ্যাকশন</h3>
      <div className={styles.quickGrid}>
        {[
          { label: "আবেদন দেখুন", href: "/admin/applications", icon: "📋" },
          { label: "মেসেজ পড়ুন", href: "/admin/messages", icon: "💬" },
          { label: "কোর্স ম্যানেজ", href: "/admin/courses", icon: "📚" },
          { label: "ব্লগ লিখুন", href: "/admin/blog", icon: "✏️" },
          { label: "এনরোলমেন্ট", href: "/admin/enrollments", icon: "🎓" },
          { label: "টিম ম্যানেজ", href: "/admin/team", icon: "👥" },
          { label: "প্রশংসাপত্র", href: "/admin/testimonials", icon: "⭐" },
          { label: "ব্যবহারকারী", href: "/admin/users", icon: "👤" },
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
