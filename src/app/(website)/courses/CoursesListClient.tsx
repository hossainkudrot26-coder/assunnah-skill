"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    BriefcaseIcon, ChartIcon, ScissorsIcon, ChefHatIcon, CarIcon,
    ShoeIcon, ClockIcon, BookIcon, ArrowRightIcon, AwardIcon,
    CheckCircleIcon, CodeIcon, WrenchIcon, LanguageIcon, VideoIcon,
    SearchIcon,
} from "@/shared/components/Icons";
import styles from "./courses.module.css";

// ──────────── Icon Map ────────────

const iconMap: Record<string, React.ReactNode> = {
    BriefcaseIcon: <BriefcaseIcon size={28} color="#1B8A50" />,
    ChefHatIcon: <ChefHatIcon size={28} color="#E65100" />,
    ChartIcon: <ChartIcon size={28} color="#1565C0" />,
    ScissorsIcon: <ScissorsIcon size={28} color="#AD1457" />,
    ShoeIcon: <ShoeIcon size={28} color="#795548" />,
    CarIcon: <CarIcon size={28} color="#2E7D32" />,
    CodeIcon: <CodeIcon size={28} color="#6A1B9A" />,
    WrenchIcon: <WrenchIcon size={28} color="#37474F" />,
    LanguageIcon: <LanguageIcon size={28} color="#0277BD" />,
    VideoIcon: <VideoIcon size={28} color="#C62828" />,
};

// ──────────── Types ────────────

interface CourseFee {
    admission: string;
    total: string | null;
    scholarship: string | null;
}

interface SyllabusModule {
    title: string;
    topics: string[];
}

interface CourseListItem {
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    shortDesc: string;
    duration: string;
    type: string;
    category: string | null;
    iconName: string | null;
    color: string;
    fee: CourseFee | null;
    syllabus: SyllabusModule[];
}

// ──────────── Animation ────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

// ──────────── Filter logic ────────────

const typeFilters = ["সকল", "আবাসিক", "ফ্রি", "নারীদের জন্য"];

function matchesFilter(course: CourseListItem, filter: string): boolean {
    if (filter === "সকল") return true;
    if (filter === "নারীদের জন্য") return course.category === "শুধুমাত্র নারী";
    if (filter === "আবাসিক") {
        return course.type === "আবাসিক" || course.type === "সম্পূর্ণ আবাসিক" || course.type === "রেসিডেন্সিয়াল";
    }
    return course.type === filter;
}

// ──────────── Component ────────────

export default function CoursesListClient({ courses }: { courses: CourseListItem[] }) {
    const [filter, setFilter] = useState("সকল");
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = courses.filter((c) => {
        if (!matchesFilter(c, filter)) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            c.title.toLowerCase().includes(q) ||
            (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
            c.shortDesc.toLowerCase().includes(q)
        );
    });

    return (
        <section className={styles.coursesSection}>
            <div className="container">
                {/* Search */}
                <div className={styles.searchBar}>
                    <SearchIcon size={18} color="var(--color-neutral-400)" />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="কোর্স খুঁজুন..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className={styles.searchClear} onClick={() => setSearch("")}>✕</button>
                    )}
                </div>

                {/* Filter */}
                <motion.div
                    className={styles.filterBar}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                >
                    {typeFilters.map((t) => (
                        <button
                            key={t}
                            className={`${styles.filterBtn} ${filter === t ? styles.filterBtnActive : ""}`}
                            onClick={() => setFilter(t)}
                        >
                            {t}
                        </button>
                    ))}
                </motion.div>

                <p className={styles.resultCount}>{filtered.length}টি কোর্স পাওয়া গেছে</p>

                {/* Course Cards */}
                <motion.div
                    className={styles.coursesList}
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    key={filter}
                >
                    {filtered.map((course) => (
                        <motion.div key={course.id} className={styles.courseCard} variants={fadeUp}>
                            <div className={styles.courseCardLeft} style={{ borderLeftColor: course.color }}>
                                <div className={styles.courseIconBox} style={{ background: `${course.color}12`, borderColor: `${course.color}25` }}>
                                    {course.iconName ? iconMap[course.iconName] : null}
                                </div>
                                <div>
                                    <div className={styles.courseBadges}>
                                        <span className={styles.courseBadge} style={{ background: `${course.color}15`, color: course.color }}>
                                            {course.type}
                                        </span>
                                        <span className={styles.courseBadgeFee}>
                                            {course.fee?.admission === "বিনামূল্যে" ? "ফ্রি" : course.fee?.scholarship || ""}
                                        </span>
                                    </div>
                                    <h3 className={styles.courseTitle}>{course.title}</h3>
                                    {course.titleEn && <p className={styles.courseSubtitle}>{course.titleEn}</p>}
                                </div>
                            </div>

                            <p className={styles.courseDesc}>{course.shortDesc}</p>

                            <div className={styles.courseMeta}>
                                <span>
                                    <ClockIcon size={14} color="var(--color-neutral-500)" />
                                    {course.duration}
                                </span>
                                <span>{course.syllabus.length} মডিউল</span>
                            </div>

                            {/* Expandable Syllabus */}
                            <button
                                className={styles.syllabusToggle}
                                onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
                            >
                                {expandedId === course.id ? "সিলেবাস লুকান" : "সিলেবাস দেখুন"}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    style={{ transform: expandedId === course.id ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
                                    <polyline points="6,9 12,15 18,9" />
                                </svg>
                            </button>
                            {expandedId === course.id && (
                                <div className={styles.syllabus}>
                                    {course.syllabus.map((mod, i) => (
                                        <div key={i} className={styles.syllabusModule}>
                                            <strong>{mod.title}</strong>
                                            <ul>
                                                {mod.topics.map((t, j) => (
                                                    <li key={j}>
                                                        <CheckCircleIcon size={13} color="var(--color-primary-500)" />
                                                        {t}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Detail Link */}
                            <Link href={`/courses/${course.slug}`} className={styles.detailLink}>
                                বিস্তারিত দেখুন
                                <ArrowRightIcon size={14} color="var(--color-primary-500)" />
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scholarship CTA */}
                <motion.div
                    className={styles.scholarshipCta}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease }}
                >
                    <AwardIcon size={32} color="var(--color-accent-400)" />
                    <h2>স্কলারশিপ সুবিধা</h2>
                    <p>মেধাবী ও সুবিধাবঞ্চিত শিক্ষার্থীদের জন্য <strong>১০০% পর্যন্ত</strong> স্কলারশিপ</p>
                    <Link href="/scholarship" className={styles.scholarshipBtn}>
                        স্কলারশিপ তথ্য দেখুন
                        <ArrowRightIcon size={15} color="white" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
