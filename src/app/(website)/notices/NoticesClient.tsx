"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  MegaphoneIcon, CalendarIcon, AwardIcon, BookIcon,
  UsersIcon, GraduationIcon, ArrowRightIcon, ShieldCheckIcon,
} from "@/shared/components/Icons";
import styles from "./notices.module.css";

type NoticeType = "ADMISSION" | "EXAM" | "RESULT" | "EVENT" | "GENERAL";

interface Notice {
  id: string;
  title: string;
  description: string;
  type: NoticeType;
  isImportant: boolean;
  link: string | null;
  publishedAt: string; // serialized Date
}

const typeLabels: Record<NoticeType, string> = {
  ADMISSION: "ভর্তি",
  EXAM: "পরীক্ষা",
  RESULT: "ফলাফল",
  EVENT: "ইভেন্ট",
  GENERAL: "সাধারণ",
};

const typeConfig: Record<NoticeType, { icon: React.ReactNode; color: string }> = {
  ADMISSION: { icon: <GraduationIcon size={16} color="#1B8A50" />, color: "#1B8A50" },
  EXAM: { icon: <BookIcon size={16} color="#1565C0" />, color: "#1565C0" },
  RESULT: { icon: <AwardIcon size={16} color="#E65100" />, color: "#E65100" },
  EVENT: { icon: <UsersIcon size={16} color="#7B1FA2" />, color: "#7B1FA2" },
  GENERAL: { icon: <MegaphoneIcon size={16} color="#37474F" />, color: "#37474F" },
};

const allTypes: NoticeType[] = ["ADMISSION", "EXAM", "RESULT", "EVENT", "GENERAL"];

function formatBanglaDate(isoString: string): string {
  const d = new Date(isoString);
  const months = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  const toBn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  return `${toBn(d.getDate())} ${months[d.getMonth()]} ${toBn(d.getFullYear())}`;
}

export default function NoticesClient({ notices }: { notices: Notice[] }) {
  const [activeFilter, setActiveFilter] = useState<NoticeType | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (activeFilter === "ALL") return notices;
    return notices.filter((n) => n.type === activeFilter);
  }, [activeFilter, notices]);

  return (
    <>
      <PageHeader
        title="নোটিশ বোর্ড"
        subtitle="ভর্তি বিজ্ঞপ্তি, পরীক্ষার সময়সূচি, ফলাফল এবং সকল গুরুত্বপূর্ণ ঘোষণা"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "নোটিশ বোর্ড" },
        ]}
        badge={{ icon: <MegaphoneIcon size={14} color="var(--color-secondary-300)" />, text: "নোটিশ বোর্ড" }}
      />

      <section className={`section ${styles.noticesSection}`}>
        <div className="container">
          {/* Filter Chips */}
          <div className={styles.filterRow}>
            <button
              className={`${styles.filterChip} ${activeFilter === "ALL" ? styles.chipActive : ""}`}
              onClick={() => setActiveFilter("ALL")}
            >
              সব ({notices.length})
            </button>
            {allTypes.map((type) => {
              const count = notices.filter((n) => n.type === type).length;
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  className={`${styles.filterChip} ${activeFilter === type ? styles.chipActive : ""}`}
                  onClick={() => setActiveFilter(type)}
                >
                  {typeConfig[type].icon}
                  {typeLabels[type]} ({count})
                </button>
              );
            })}
          </div>

          {/* Notices List */}
          <div className={styles.noticesList}>
            <AnimatePresence mode="popLayout">
              {filtered.map((notice) => (
                <motion.div
                  key={notice.id}
                  className={`${styles.noticeCard} ${notice.isImportant ? styles.noticeImportant : ""}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.noticeLeft}>
                    <div
                      className={styles.noticeIcon}
                      style={{ background: `${typeConfig[notice.type].color}12`, borderColor: `${typeConfig[notice.type].color}25` }}
                    >
                      {typeConfig[notice.type].icon}
                    </div>
                  </div>
                  <div className={styles.noticeContent}>
                    <div className={styles.noticeMeta}>
                      <span
                        className={styles.noticeType}
                        style={{ background: `${typeConfig[notice.type].color}12`, color: typeConfig[notice.type].color }}
                      >
                        {typeLabels[notice.type]}
                      </span>
                      <span className={styles.noticeDate}>
                        <CalendarIcon size={12} color="var(--color-neutral-400)" />
                        {formatBanglaDate(notice.publishedAt)}
                      </span>
                      {notice.isImportant && (
                        <span className={styles.noticeUrgent}>
                          <ShieldCheckIcon size={12} color="#C62828" />
                          গুরুত্বপূর্ণ
                        </span>
                      )}
                    </div>
                    <h3 className={styles.noticeTitle}>{notice.title}</h3>
                    <p className={styles.noticeDesc}>{notice.description}</p>
                    {notice.link && (
                      <Link href={notice.link} className={styles.noticeLink}>
                        বিস্তারিত দেখুন
                        <ArrowRightIcon size={14} color="var(--color-primary-500)" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className={styles.emptyState}>
                <MegaphoneIcon size={48} color="var(--color-neutral-300)" />
                <p>এই ক্যাটাগরিতে কোনো নোটিশ নেই</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
