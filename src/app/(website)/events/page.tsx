"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  CalendarIcon, ClockIcon, MapPinIcon, UsersIcon,
  ArrowRightIcon, SparkleIcon, CheckCircleIcon,
} from "@/shared/components/Icons";
import styles from "./events.module.css";

type EventStatus = "আসন্ন" | "চলমান" | "সম্পন্ন";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: EventStatus;
  type: "ভর্তি" | "সেমিনার" | "ওয়ার্কশপ" | "অনুষ্ঠান" | "পরীক্ষা";
  attendees?: number;
}

const events: EventItem[] = [
  {
    id: "1",
    title: "ক্যারিয়ার ফেয়ার ২০২৬",
    date: "২০ মার্চ ২০২৬",
    time: "সকাল ১০:০০ — বিকাল ৫:০০",
    location: "আস-সুন্নাহ ক্যাম্পাস, উত্তর বাড্ডা",
    description: "বিভিন্ন কোম্পানি ও প্রতিষ্ঠানের সাথে সরাসরি সাক্ষাৎ, ইন্টারভিউ ও নেটওয়ার্কিং-এর সুযোগ। সকল গ্র্যাজুয়েট ও চলমান ব্যাচের শিক্ষার্থীরা অংশ নিতে পারবেন।",
    status: "আসন্ন",
    type: "অনুষ্ঠান",
    attendees: 200,
  },
  {
    id: "2",
    title: "হালাল উপার্জন — ইসলামিক সেমিনার",
    date: "৭ মার্চ ২০২৬",
    time: "বিকাল ৪:০০ — সন্ধ্যা ৬:৩০",
    location: "ইনস্টিটিউট সেমিনার হল",
    description: "'হালাল উপার্জনের পথ ও পদ্ধতি' শীর্ষক সেমিনার। বক্তা: শায়খ আহমাদুল্লাহ। সবার জন্য উন্মুক্ত।",
    status: "আসন্ন",
    type: "সেমিনার",
  },
  {
    id: "3",
    title: "ব্যাচ ১৭ — ওরিয়েন্টেশন",
    date: "১ এপ্রিল ২০২৬",
    time: "সকাল ৯:০০ — দুপুর ১২:০০",
    location: "আস-সুন্নাহ ক্যাম্পাস",
    description: "স্মল বিজনেস ম্যানেজমেন্ট ব্যাচ ১৭-এর নবাগত প্রশিক্ষণার্থীদের ওরিয়েন্টেশন ও ক্যাম্পাস ট্যুর।",
    status: "আসন্ন",
    type: "ভর্তি",
    attendees: 30,
  },
  {
    id: "4",
    title: "ডিজিটাল মার্কেটিং ওয়ার্কশপ",
    date: "১৫ ফেব্রুয়ারি ২০২৬",
    time: "সকাল ১০:০০ — দুপুর ১:০০",
    location: "কম্পিউটার ল্যাব-৩",
    description: "ফেসবুক ও ইনস্টাগ্রাম অ্যাডস হ্যান্ডস-অন ওয়ার্কশপ। SBM ব্যাচ ১৬ এর শিক্ষার্থীদের জন্য।",
    status: "সম্পন্ন",
    type: "ওয়ার্কশপ",
    attendees: 28,
  },
  {
    id: "5",
    title: "ব্যাচ ১৫ — সার্টিফিকেট বিতরণ",
    date: "১৮ ফেব্রুয়ারি ২০২৬",
    time: "বিকাল ৩:০০ — ৫:০০",
    location: "আস-সুন্নাহ সেমিনার হল",
    description: "স্মল বিজনেস ম্যানেজমেন্ট ব্যাচ ১৫-এর সফল গ্র্যাজুয়েটদের NSDA সার্টিফিকেট বিতরণ অনুষ্ঠান।",
    status: "সম্পন্ন",
    type: "অনুষ্ঠান",
    attendees: 35,
  },
  {
    id: "6",
    title: "রান্নার প্রতিযোগিতা — শেফ ব্যাচ ১৩",
    date: "১০ মার্চ ২০২৬",
    time: "সকাল ১১:০০ — দুপুর ২:০০",
    location: "ইনস্টিটিউট কিচেন",
    description: "শেফ ট্রেনিং ব্যাচ ১৩-এর প্রশিক্ষণার্থীদের মধ্যে রান্নার প্রতিযোগিতা। বিজয়ীদের পুরস্কার দেওয়া হবে।",
    status: "আসন্ন",
    type: "অনুষ্ঠান",
    attendees: 25,
  },
];

const statusColors: Record<EventStatus, string> = {
  "আসন্ন": "#1B8A50",
  "চলমান": "#1565C0",
  "সম্পন্ন": "#78909C",
};

export default function EventsPage() {
  const [filter, setFilter] = useState<EventStatus | "সব">("সব");
  const filtered = filter === "সব" ? events : events.filter((e) => e.status === filter);

  const upcoming = events.filter((e) => e.status === "আসন্ন");

  return (
    <>
      <PageHeader
        title="ইভেন্ট ক্যালেন্ডার"
        subtitle="ভর্তি অনুষ্ঠান, সেমিনার, ওয়ার্কশপ এবং আসন্ন কার্যক্রম"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "ইভেন্ট" },
        ]}
        badge={{ icon: <CalendarIcon size={14} color="var(--color-secondary-300)" />, text: "ইভেন্ট" }}
      />

      {/* Upcoming Highlight */}
      {upcoming.length > 0 && (
        <section className={styles.highlightSection}>
          <div className="container">
            <div className={styles.highlightCard}>
              <div className={styles.highlightBadge}>
                <SparkleIcon size={14} color="white" />
                আসন্ন ইভেন্ট
              </div>
              <h2 className={styles.highlightTitle}>{upcoming[0].title}</h2>
              <p className={styles.highlightDesc}>{upcoming[0].description}</p>
              <div className={styles.highlightMeta}>
                <span><CalendarIcon size={14} color="rgba(255,255,255,0.7)" /> {upcoming[0].date}</span>
                <span><ClockIcon size={14} color="rgba(255,255,255,0.7)" /> {upcoming[0].time}</span>
                <span><MapPinIcon size={14} color="rgba(255,255,255,0.7)" /> {upcoming[0].location}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={`section ${styles.eventsSection}`}>
        <div className="container">
          {/* Filter */}
          <div className={styles.filterRow}>
            {(["সব", "আসন্ন", "চলমান", "সম্পন্ন"] as const).map((f) => (
              <button
                key={f}
                className={`${styles.filterChip} ${filter === f ? styles.chipActive : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className={styles.eventsGrid}>
            <AnimatePresence mode="popLayout">
              {filtered.map((event) => (
                <motion.div
                  key={event.id}
                  className={styles.eventCard}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className={styles.eventHeader}>
                    <span className={styles.eventType}>{event.type}</span>
                    <span className={styles.eventStatus} style={{ background: `${statusColors[event.status]}15`, color: statusColors[event.status] }}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDesc}>{event.description}</p>
                  <div className={styles.eventMeta}>
                    <span><CalendarIcon size={13} color="var(--color-neutral-400)" /> {event.date}</span>
                    <span><ClockIcon size={13} color="var(--color-neutral-400)" /> {event.time}</span>
                    <span><MapPinIcon size={13} color="var(--color-neutral-400)" /> {event.location}</span>
                    {event.attendees && (
                      <span><UsersIcon size={13} color="var(--color-neutral-400)" /> {event.attendees} জন</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
