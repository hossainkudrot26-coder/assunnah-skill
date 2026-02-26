"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  MegaphoneIcon, CalendarIcon, AwardIcon, BookIcon,
  UsersIcon, GraduationIcon, ArrowRightIcon, ShieldCheckIcon,
  ClockIcon,
} from "@/shared/components/Icons";
import styles from "./notices.module.css";

type NoticeType = "ভর্তি" | "পরীক্ষা" | "ফলাফল" | "ইভেন্ট" | "সাধারণ";

interface Notice {
  id: string;
  title: string;
  date: string;
  type: NoticeType;
  description: string;
  important?: boolean;
  link?: string;
}

const notices: Notice[] = [
  {
    id: "1",
    title: "ব্যাচ ১৭ — ভর্তি বিজ্ঞপ্তি",
    date: "২৫ ফেব্রুয়ারি ২০২৬",
    type: "ভর্তি",
    description: "স্মল বিজনেস ম্যানেজমেন্ট কোর্সে ব্যাচ ১৭-এ ভর্তি চলছে। আসন সংখ্যা ৩০টি। আগ্রহী প্রার্থীদের অনলাইনে আবেদন করতে অনুরোধ করা হচ্ছে।",
    important: true,
    link: "/admission/apply",
  },
  {
    id: "2",
    title: "শেফ ট্রেনিং ব্যাচ ১৪ — আবেদন শুরু",
    date: "২০ ফেব্রুয়ারি ২০২৬",
    type: "ভর্তি",
    description: "শেফ ট্রেনিং অ্যান্ড কিচেন ম্যানেজমেন্ট কোর্সের ১৪তম ব্যাচে ভর্তির আবেদন গ্রহণ শুরু হয়েছে। কোর্সটি সম্পূর্ণ বিনামূল্যে।",
    important: true,
    link: "/courses/chef-training",
  },
  {
    id: "3",
    title: "ব্যাচ ১৬ — মধ্যবর্তী পরীক্ষা",
    date: "১৫ ফেব্রুয়ারি ২০২৬",
    type: "পরীক্ষা",
    description: "স্মল বিজনেস ম্যানেজমেন্ট ব্যাচ ১৬-এর মধ্যবর্তী মূল্যায়ন পরীক্ষা ২০ ফেব্রুয়ারি (বৃহস্পতিবার) অনুষ্ঠিত হবে। সকল প্রশিক্ষণার্থীদের উপস্থিত থাকতে হবে।",
  },
  {
    id: "4",
    title: "ব্যাচ ১৫ — চূড়ান্ত ফলাফল প্রকাশ",
    date: "১০ ফেব্রুয়ারি ২০২৬",
    type: "ফলাফল",
    description: "স্মল বিজনেস ম্যানেজমেন্ট ব্যাচ ১৫-এর চূড়ান্ত পরীক্ষার ফলাফল প্রকাশিত হয়েছে। সার্টিফিকেট বিতরণী অনুষ্ঠান ১৮ ফেব্রুয়ারি হবে।",
  },
  {
    id: "5",
    title: "ক্যারিয়ার ফেয়ার ২০২৬",
    date: "৫ ফেব্রুয়ারি ২০২৬",
    type: "ইভেন্ট",
    description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের প্রথম ক্যারিয়ার ফেয়ার ২০ মার্চ ২০২৬ অনুষ্ঠিত হবে। বিভিন্ন কোম্পানি ও প্রতিষ্ঠান অংশগ্রহণ করবে।",
  },
  {
    id: "6",
    title: "নতুন শেড নির্মাণ আপডেট",
    date: "১ ফেব্রুয়ারি ২০২৬",
    type: "সাধারণ",
    description: "৩২,৫০০ বর্গফুটের নতুন প্রশিক্ষণ কেন্দ্রের নির্মাণ কাজ ৬০% সম্পন্ন হয়েছে। আশা করা হচ্ছে ২০২৬ সালের জুনে কার্যক্রম শুরু হবে।",
  },
  {
    id: "7",
    title: "ইসলামিক সেমিনার — হালাল উপার্জন",
    date: "২৫ জানুয়ারি ২০২৬",
    type: "ইভেন্ট",
    description: "'হালাল উপার্জনের পথ ও পদ্ধতি' শীর্ষক সেমিনার আগামী শুক্রবার বিকাল ৪টায় ইনস্টিটিউট ক্যাম্পাসে অনুষ্ঠিত হবে। সবাইকে আমন্ত্রণ।",
  },
  {
    id: "8",
    title: "সেলস ও মার্কেটিং ব্যাচ ৪ শুরু",
    date: "১ জানুয়ারি ২০২৬",
    type: "ভর্তি",
    description: "দি আর্ট অব সেলস অ্যান্ড মার্কেটিং কোর্সের ৪র্থ ব্যাচ আনুষ্ঠানিকভাবে শুরু হয়েছে। ২০ জন প্রশিক্ষণার্থী অংশ নিচ্ছেন।",
  },
];

const typeConfig: Record<NoticeType, { icon: React.ReactNode; color: string }> = {
  "ভর্তি": { icon: <GraduationIcon size={16} color="#1B8A50" />, color: "#1B8A50" },
  "পরীক্ষা": { icon: <BookIcon size={16} color="#1565C0" />, color: "#1565C0" },
  "ফলাফল": { icon: <AwardIcon size={16} color="#E65100" />, color: "#E65100" },
  "ইভেন্ট": { icon: <UsersIcon size={16} color="#7B1FA2" />, color: "#7B1FA2" },
  "সাধারণ": { icon: <MegaphoneIcon size={16} color="#37474F" />, color: "#37474F" },
};

const allTypes: NoticeType[] = ["ভর্তি", "পরীক্ষা", "ফলাফল", "ইভেন্ট", "সাধারণ"];

export default function NoticesPage() {
  const [activeFilter, setActiveFilter] = useState<NoticeType | "সব">("সব");

  const filtered = useMemo(() => {
    if (activeFilter === "সব") return notices;
    return notices.filter((n) => n.type === activeFilter);
  }, [activeFilter]);

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
              className={`${styles.filterChip} ${activeFilter === "সব" ? styles.chipActive : ""}`}
              onClick={() => setActiveFilter("সব")}
            >
              সব ({notices.length})
            </button>
            {allTypes.map((type) => {
              const count = notices.filter((n) => n.type === type).length;
              return (
                <button
                  key={type}
                  className={`${styles.filterChip} ${activeFilter === type ? styles.chipActive : ""}`}
                  onClick={() => setActiveFilter(type)}
                >
                  {typeConfig[type].icon}
                  {type} ({count})
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
                  className={`${styles.noticeCard} ${notice.important ? styles.noticeImportant : ""}`}
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
                        {notice.type}
                      </span>
                      <span className={styles.noticeDate}>
                        <CalendarIcon size={12} color="var(--color-neutral-400)" />
                        {notice.date}
                      </span>
                      {notice.important && (
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
