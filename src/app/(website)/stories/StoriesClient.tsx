"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircleIcon, AwardIcon, ArrowRightIcon, QuoteIcon,
    TrophyIcon, BriefcaseIcon, StarIcon, UsersIcon,
} from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import styles from "./stories.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface Story {
    name: string;
    initials: string;
    batch: string;
    course: string;
    story: string;
    achievement: string;
    currentRole: string;
    monthlyIncome: string;
    color: string;
    rating: number;
}

interface StoriesClientProps {
    stories: Story[];
}

const ease = [0.22, 1, 0.36, 1] as const;

const overallStats = [
    { value: "৯৫%", label: "কর্মসংস্থান হার", icon: <TrophyIcon size={24} color="var(--color-accent-400)" /> },
    { value: "২,৫০০+", label: "সফল গ্র্যাজুয়েট", icon: <UsersIcon size={24} color="var(--color-secondary-400)" /> },
    { value: "২০,০০০+", label: "গড় মাসিক আয়", icon: <BriefcaseIcon size={24} color="var(--color-primary-400)" /> },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function StoriesClient({ stories }: StoriesClientProps) {
    const [filter, setFilter] = useState("সব");

    const allCourses = [...new Set(stories.map((s) => s.course))];
    const filtered = filter === "সব" ? stories : stories.filter((s) => s.course === filter);

    return (
        <>
            <PageHeader
                title="যারা বদলেছেন নিজেদের ভাগ্য"
                subtitle="আমাদের শিক্ষার্থীরা কিভাবে প্রশিক্ষণ নিয়ে জীবন বদলে দিয়েছেন"
                breadcrumbs={[
                    { label: "হোম", href: "/" },
                    { label: "সাফল্যের গল্প" },
                ]}
                badge={{ icon: <MessageCircleIcon size={14} color="var(--color-secondary-300)" />, text: "সাফল্যের গল্প" }}
            />

            {/* Overall Stats */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        {overallStats.map((s, i) => (
                            <motion.div
                                key={i}
                                className={styles.statCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                            >
                                {s.icon}
                                <strong>{s.value}</strong>
                                <span>{s.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter */}
            <section className={styles.storiesSection}>
                <div className="container">
                    <div className={styles.filterBar}>
                        <span className={styles.filterLabel}>কোর্স অনুযায়ী ফিল্টার:</span>
                        <div className={styles.filterChips}>
                            <button
                                className={`${styles.filterChip} ${filter === "সব" ? styles.filterChipActive : ""}`}
                                onClick={() => setFilter("সব")}
                            >
                                সব ({stories.length})
                            </button>
                            {allCourses.map((c) => (
                                <button
                                    key={c}
                                    className={`${styles.filterChip} ${filter === c ? styles.filterChipActive : ""}`}
                                    onClick={() => setFilter(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stories Grid */}
                    <div className={styles.storiesGrid}>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((s) => (
                                <motion.div
                                    key={s.name}
                                    className={styles.storyCard}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.35, ease }}
                                >
                                    {/* Quote */}
                                    <div className={styles.quoteIcon}>
                                        <QuoteIcon size={20} color={`${s.color}25`} />
                                    </div>
                                    <p className={styles.storyText}>&ldquo;{s.story}&rdquo;</p>

                                    {/* Stars */}
                                    <div className={styles.storyStars}>
                                        {[...Array(s.rating)].map((_, j) => (
                                            <StarIcon key={j} size={14} color="var(--color-accent-400)" />
                                        ))}
                                    </div>

                                    {/* Author */}
                                    <div className={styles.storyFooter}>
                                        <div className={styles.storyHeader}>
                                            <div className={styles.storyAvatar} style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)` }}>
                                                <span>{s.initials}</span>
                                            </div>
                                            <div>
                                                <h3>{s.name}</h3>
                                                <span className={styles.storyBatch}>{s.batch}</span>
                                            </div>
                                        </div>
                                        <div className={styles.storyMeta}>
                                            <span className={styles.storyIncome} style={{ color: s.color, background: `${s.color}0C`, borderColor: `${s.color}20` }}>
                                                <BriefcaseIcon size={13} color={s.color} />
                                                {s.currentRole}
                                            </span>
                                            {s.monthlyIncome && (
                                                <span className={styles.incomeTag}>
                                                    ৳ {s.monthlyIncome}/মাস
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-neutral-400)" }}>
                            এই ক্যাটাগরিতে কোনো গল্প নেই
                        </div>
                    )}

                    {/* "তারা এখন কোথায়?" Section */}
                    <motion.div
                        className={styles.whereNowSection}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>তারা এখন কোথায়?</h3>
                        <p className={styles.whereNowDesc}>আমাদের গ্র্যাজুয়েটরা বিভিন্ন সেক্টরে সফলভাবে কর্মরত</p>
                        <div className={styles.whereNowGrid}>
                            {stories.map((s, i) => (
                                <div key={i} className={styles.whereNowCard}>
                                    <div className={styles.whereNowAvatar} style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)` }}>
                                        {s.initials}
                                    </div>
                                    <div className={styles.whereNowInfo}>
                                        <strong>{s.name}</strong>
                                        <span>{s.currentRole}</span>
                                    </div>
                                    {s.monthlyIncome && (
                                        <span className={styles.whereNowIncome}>৳{s.monthlyIncome}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <div className={styles.storiesCta}>
                        <h3>আপনিও কি আমাদের শিক্ষার্থী?</h3>
                        <p>আপনার সাফল্যের গল্প আমাদের সাথে শেয়ার করুন</p>
                        <div className={styles.ctaActions}>
                            <Link href="/admission/apply" className={styles.ctaBtnPrimary}>
                                এখনই ভর্তি হন
                                <ArrowRightIcon size={15} color="white" />
                            </Link>
                            <Link href="/contact" className={styles.ctaBtn}>
                                গল্প শেয়ার করুন
                                <ArrowRightIcon size={15} color="white" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
