"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  CalendarIcon, ClockIcon, MapPinIcon, UsersIcon,
  SparkleIcon,
} from "@/shared/components/Icons";
import styles from "./events.module.css";

type EventStatusType = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
type EventTypeType = "ADMISSION" | "SEMINAR" | "WORKSHOP" | "CEREMONY" | "EXAM";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  time: string;
  location: string;
  status: EventStatusType;
  type: EventTypeType;
  attendees: number | null;
}

const statusLabels: Record<EventStatusType, string> = {
  UPCOMING: "আসন্ন",
  ONGOING: "চলমান",
  COMPLETED: "সম্পন্ন",
  CANCELLED: "বাতিল",
};

const typeLabels: Record<EventTypeType, string> = {
  ADMISSION: "ভর্তি",
  SEMINAR: "সেমিনার",
  WORKSHOP: "ওয়ার্কশপ",
  CEREMONY: "অনুষ্ঠান",
  EXAM: "পরীক্ষা",
};

const statusColors: Record<EventStatusType, string> = {
  UPCOMING: "#1B8A50",
  ONGOING: "#1565C0",
  COMPLETED: "#78909C",
  CANCELLED: "#C62828",
};

function formatBanglaDate(isoString: string): string {
  const d = new Date(isoString);
  const months = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  const toBn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  return `${toBn(d.getDate())} ${months[d.getMonth()]} ${toBn(d.getFullYear())}`;
}

const toBn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

export default function EventsClient({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState<EventStatusType | "ALL">("ALL");
  const filtered = filter === "ALL" ? events : events.filter((e) => e.status === filter);

  const upcoming = events.filter((e) => e.status === "UPCOMING");

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
                <span><CalendarIcon size={14} color="rgba(255,255,255,0.7)" /> {formatBanglaDate(upcoming[0].date)}</span>
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
            {(["ALL", "UPCOMING", "ONGOING", "COMPLETED"] as const).map((f) => (
              <button
                key={f}
                className={`${styles.filterChip} ${filter === f ? styles.chipActive : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" ? "সব" : statusLabels[f]}
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
                    <span className={styles.eventType}>{typeLabels[event.type]}</span>
                    <span className={styles.eventStatus} style={{ background: `${statusColors[event.status]}15`, color: statusColors[event.status] }}>
                      {statusLabels[event.status]}
                    </span>
                  </div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDesc}>{event.description}</p>
                  <div className={styles.eventMeta}>
                    <span><CalendarIcon size={13} color="var(--color-neutral-400)" /> {formatBanglaDate(event.date)}</span>
                    <span><ClockIcon size={13} color="var(--color-neutral-400)" /> {event.time}</span>
                    <span><MapPinIcon size={13} color="var(--color-neutral-400)" /> {event.location}</span>
                    {event.attendees && (
                      <span><UsersIcon size={13} color="var(--color-neutral-400)" /> {toBn(event.attendees)} জন</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className={styles.emptyState}>
                <CalendarIcon size={48} color="var(--color-neutral-300)" />
                <p>এই ক্যাটাগরিতে কোনো ইভেন্ট নেই</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
