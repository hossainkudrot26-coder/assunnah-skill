"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BriefcaseIcon, ChartIcon, ScissorsIcon, ChefHatIcon, CodeIcon, CarIcon,
    FilmIcon, ZapIcon, WrenchIcon, ShoeIcon, ClockIcon, BookIcon,
    UserIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon, ClipboardIcon, AwardIcon,
} from "@/shared/components/Icons";
import styles from "./courses.module.css";

const courseIcons: Record<string, React.ReactNode> = {
    briefcase: <BriefcaseIcon size={28} color="#1B8A50" />,
    chef: <ChefHatIcon size={28} color="#E65100" />,
    chart: <ChartIcon size={28} color="#1565C0" />,
    scissors: <ScissorsIcon size={28} color="#AD1457" />,
    shoe: <ShoeIcon size={28} color="#795548" />,
    code: <CodeIcon size={28} color="#6A1B9A" />,
    car: <CarIcon size={28} color="#2E7D32" />,
    film: <FilmIcon size={28} color="#F44336" />,
    zap: <ZapIcon size={28} color="#FF9800" />,
    wrench: <WrenchIcon size={28} color="#607D8B" />,
};

const allCourses = [
    {
        id: 1, title: "স্মল বিজনেস ম্যানেজমেন্ট", titleEn: "Small Business Management",
        description: "শিক্ষিত বেকার যুবকদের কারিগরি দক্ষতা বৃদ্ধি ও কর্মসংস্থান সৃষ্টির লক্ষ্যে পরিচালিত এই কোর্সে MS Office, প্র্যাকটিক্যাল অ্যাকাউন্টিং, গ্রাফিক ডিজাইন, ক্রিয়েটিভ মার্কেটিং, ভিডিও এডিটিং, জেনারেটিভ AI টুলস, প্র্যাকটিক্যাল ইংলিশ ও মৌলিক দীনি জ্ঞান শেখানো হয়। ৩০ দিন পর গ্রাফিক ডিজাইন গ্রুপ ও অ্যাকাউন্টিং গ্রুপে বিভক্ত হয়।",
        syllabus: ["MS Office (Word, Excel, PowerPoint)", "প্র্যাকটিক্যাল অ্যাকাউন্টিং", "গ্রাফিক ডিজাইন", "ক্রিয়েটিভ মার্কেটিং", "ভিডিও এডিটিং", "জেনারেটিভ AI টুলস", "প্র্যাকটিক্যাল ইংলিশ", "মৌলিক দীনি জ্ঞান"],
        duration: "৩ মাস", type: "রেসিডেন্সিয়াল", fee: "স্কলারশিপ", category: "business", gender: "men", iconKey: "briefcase", color: "#1B8A50",
    },
    {
        id: 2, title: "শেফ ট্রেনিং অ্যান্ড কিচেন ম্যানেজমেন্ট", titleEn: "Chef Training & Kitchen Management",
        description: "হসপিটালিটি ও ফুড ইন্ডাস্ট্রিতে দক্ষ শেফ ও কিচেন ম্যানেজার তৈরির জন্য ব্যবহারিক প্রশিক্ষণ। দৈনিক ১২-১৪ ঘণ্টা প্র্যাকটিক্যাল ট্রেনিং, ২৪ ঘণ্টা মেন্টর সাপোর্ট এবং রেসিডেন্সিয়াল সুবিধা — সম্পূর্ণ বিনামূল্যে।",
        syllabus: ["রান্নার মৌলিক দক্ষতা", "আন্তর্জাতিক রান্না", "বাংলাদেশি রান্না", "কিচেন ম্যানেজমেন্ট", "ফুড সেফটি ও হাইজিন", "মেনু প্ল্যানিং", "মৌলিক ইসলামি জ্ঞান"],
        duration: "৪ মাস", type: "ফ্রি", fee: "ফ্রি", category: "vocational", gender: "men", iconKey: "chef", color: "#E65100",
    },
    {
        id: 3, title: "দি আর্ট অব সেলস অ্যান্ড মার্কেটিং", titleEn: "The Art of Sales & Marketing",
        description: "দক্ষ সেলস ও মার্কেটিং পেশাদার তৈরির জন্য পরিচালিত এই কোর্সে সেলস স্ট্র্যাটেজি, কমিউনিকেশন, ব্র্যান্ডিং ও সার্ভিস মার্কেটিং শেখানো হয়। ভর্তি ফি ১০,০০০ টাকা, মোট ৬০,০০০ টাকা — ১০০% পর্যন্ত স্কলারশিপ সুবিধা।",
        syllabus: ["সেলস স্ট্র্যাটেজি", "কমিউনিকেশন স্কিল", "রিলেশনশিপ বিল্ডিং", "মার্কেটিং টেকনিক", "কর্মক্ষেত্রে শিষ্টাচার", "সার্ভিস মার্কেটিং", "ব্র্যান্ডিং", "মৌলিক ইসলামি জ্ঞান"],
        duration: "৩ মাস", type: "রেসিডেন্সিয়াল", fee: "১০০% স্কলারশিপ সুবিধা", category: "business", gender: "men", iconKey: "chart", color: "#1565C0",
    },
    {
        id: 4, title: "স্মার্ট টেইলারিং এন্ড ফ্যাশন ডিজাইন", titleEn: "Smart Tailoring & Fashion Design",
        description: "নারীদের আত্মকর্মসংস্থান ও উদ্যোক্তা হিসেবে গড়ে তোলার লক্ষ্যে টেইলারিং, টাই-ডাই, ব্লক-বাটিক, হ্যান্ড এমব্রয়ডারি ও বেসিক ফ্যাশন ডিজাইন শেখানো হয়। প্রশিক্ষণ শেষে প্রতিটি প্রশিক্ষণার্থী ৫০,০০০+ টাকার সেলাই মেশিন ও টেইলারিং সরঞ্জাম পান।",
        syllabus: ["টেইলারিং", "টাই-ডাই", "ব্লক-বাটিক", "হ্যান্ড এমব্রয়ডারি ও ক্রাফটিং", "বেসিক ফ্যাশন ডিজাইন", "ব্যবসা উন্নয়ন", "মৌলিক ইসলামি জ্ঞান"],
        duration: "৩ মাস", type: "রেসিডেন্সিয়াল", fee: "স্কলারশিপ", category: "vocational", gender: "women", iconKey: "scissors", color: "#AD1457",
    },
    {
        id: 5, title: "জুতা শিল্পে উদ্যোক্তা", titleEn: "Footwear Industry Entrepreneurship",
        description: "জুতা শিল্পে উদ্যোক্তা হওয়ার প্রশিক্ষণ — ডিজাইন থেকে উৎপাদন ও বিপণন। প্রশিক্ষণ শেষে আস-সুন্নাহ ফাউন্ডেশন থেকে উদ্যোক্তাদের জন্য আর্থিক সহায়তা প্রদান করা হয়।",
        syllabus: ["জুতা ডিজাইন", "উৎপাদন প্রক্রিয়া", "কাঁচামাল নির্বাচন", "বিপণন কৌশল", "ব্যবসা পরিকল্পনা", "মৌলিক ইসলামি জ্ঞান"],
        duration: "৩ মাস", type: "ফ্রি", fee: "ফ্রি", category: "vocational", gender: "all", iconKey: "shoe", color: "#795548",
    },
    {
        id: 6, title: "ওয়েব ডেভেলপমেন্ট", titleEn: "Web Development",
        description: "আধুনিক ওয়েব ডেভেলপমেন্ট শিখুন — HTML, CSS, JavaScript, React দিয়ে প্রফেশনাল ওয়েবসাইট তৈরি করুন।",
        syllabus: ["HTML5 ও CSS3", "JavaScript", "React.js", "API Integration", "Git & GitHub", "প্রজেক্ট ডেভেলপমেন্ট"],
        duration: "৬ মাস", type: "অনলাইন", fee: "ফ্রি", category: "tech", gender: "men", iconKey: "code", color: "#6A1B9A",
    },
    {
        id: 7, title: "ড্রাইভিং ট্রেনিং", titleEn: "Driving Training",
        description: "দক্ষ ও সৎ ড্রাইভার তৈরির লক্ষ্যে পেশাদার ড্রাইভিং প্রশিক্ষণ।",
        syllabus: ["ট্রাফিক আইন", "গাড়ি চালানোর মৌলিক দক্ষতা", "রোড সেফটি", "ইমার্জেন্সি হ্যান্ডলিং"],
        duration: "১ মাস", type: "ফ্রি", fee: "ফ্রি", category: "vocational", gender: "all", iconKey: "car", color: "#2E7D32",
    },
    {
        id: 8, title: "কন্টেন্ট ক্রিয়েশন", titleEn: "Content Creation",
        description: "ডিজিটাল কন্টেন্ট তৈরি, ভিডিও প্রোডাকশন ও সোশ্যাল মিডিয়া মার্কেটিং।",
        syllabus: ["ভিডিও প্রোডাকশন", "ফটোগ্রাফি", "কপিরাইটিং", "সোশ্যাল মিডিয়া স্ট্র্যাটেজি", "কন্টেন্ট প্ল্যানিং"],
        duration: "২ মাস", type: "অনলাইন", fee: "ফ্রি", category: "tech", gender: "all", iconKey: "film", color: "#F44336",
    },
    {
        id: 9, title: "ইলেকট্রিক ট্রেনিং", titleEn: "Electrical Training",
        description: "ইলেকট্রিক্যাল ইনস্টলেশন, মেইনটেনেন্স ও সেফটি প্রশিক্ষণ।",
        syllabus: ["বেসিক ইলেকট্রিসিটি", "ওয়্যারিং", "প্যানেল বোর্ড", "ট্রাবলশুটিং", "সেফটি প্র্যাকটিস"],
        duration: "৩ মাস", type: "ফ্রি", fee: "ফ্রি", category: "construction", gender: "men", iconKey: "zap", color: "#FF9800",
    },
    {
        id: 10, title: "প্লাম্বিং ও পাইপ ফিটিং", titleEn: "Plumbing & Pipe Fitting",
        description: "প্লাম্বিং ইনস্টলেশন ও পাইপ ফিটিং এর পেশাদার প্রশিক্ষণ।",
        syllabus: ["প্লাম্বিং ফান্ডামেন্টাল", "পাইপ কাটিং ও জয়েন্টিং", "ফিক্সচার ইনস্টলেশন", "ট্রাবলশুটিং"],
        duration: "২ মাস", type: "ফ্রি", fee: "ফ্রি", category: "construction", gender: "men", iconKey: "wrench", color: "#607D8B",
    },
];

const categories = [
    { key: "all", label: "সকল কোর্স" },
    { key: "business", label: "ব্যবসা" },
    { key: "tech", label: "প্রযুক্তি" },
    { key: "vocational", label: "ভোকেশনাল" },
    { key: "construction", label: "নির্মাণ" },
];

export default function CoursesPage() {
    const [category, setCategory] = useState("all");
    const [expanded, setExpanded] = useState<number | null>(null);

    const filtered = category === "all"
        ? allCourses
        : allCourses.filter((c) => c.category === category);

    return (
        <>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className={styles.pageHeaderBg} />
                <div className={`container ${styles.pageHeaderContent}`}>
                    <span className="section-badge section-badge-dark">
                        <BookIcon size={14} color="var(--color-secondary-400)" />
                        কোর্সসমূহ
                    </span>
                    <h1 className="heading-lg" style={{ color: "white" }}>
                        আমাদের <span className="gradient-text">কোর্স ক্যাটালগ</span>
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "600px", fontSize: "var(--text-lg)" }}>
                        ব্যবসা, প্রযুক্তি, কারিগরি — আপনার পছন্দের দক্ষতা অর্জন করুন
                    </p>
                </div>
            </section>

            {/* Filter + Grid */}
            <section className={`section ${styles.coursesSection}`}>
                <div className="container">
                    {/* Category Filter */}
                    <div className={styles.filterBar}>
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                className={`${styles.filterBtn} ${category === cat.key ? styles.filterBtnActive : ""}`}
                                onClick={() => setCategory(cat.key)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <p className={styles.resultCount}>{filtered.length}টি কোর্স পাওয়া গেছে</p>

                    {/* Course Cards */}
                    <div className={styles.coursesList}>
                        {filtered.map((course) => (
                            <div key={course.id} className={styles.courseCard}>
                                <div className={styles.courseCardLeft} style={{ borderLeftColor: course.color }}>
                                    <div className={styles.courseIconBox} style={{ background: `${course.color}12`, borderColor: `${course.color}25` }}>
                                        {courseIcons[course.iconKey]}
                                    </div>
                                    <div>
                                        <div className={styles.courseBadges}>
                                            <span className={styles.courseBadge} style={{ background: `${course.color}15`, color: course.color }}>
                                                {course.type}
                                            </span>
                                            <span className={styles.courseBadgeFee}>{course.fee}</span>
                                            {course.gender === "women" && (
                                                <span className={styles.courseBadge} style={{ background: "#F8BBD015", color: "#AD1457" }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                    নারীদের জন্য
                                                </span>
                                            )}
                                            {course.gender === "men" && (
                                                <span className={styles.courseBadge} style={{ background: "#E3F2FD15", color: "#1565C0" }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                    পুরুষদের জন্য
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={styles.courseTitle}>{course.title}</h3>
                                        <p className={styles.courseSubtitle}>{course.titleEn}</p>
                                    </div>
                                </div>
                                <p className={styles.courseDesc}>{course.description}</p>
                                <div className={styles.courseMeta}>
                                    <span>
                                        <ClockIcon size={14} color="var(--color-neutral-500)" />
                                        {course.duration}
                                    </span>
                                </div>

                                {/* Expandable Syllabus */}
                                <button
                                    className={styles.syllabusToggle}
                                    onClick={() => setExpanded(expanded === course.id ? null : course.id)}
                                >
                                    {expanded === course.id ? "সিলেবাস লুকান" : "সিলেবাস দেখুন"}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        style={{ transform: expanded === course.id ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
                                        <polyline points="6,9 12,15 18,9" />
                                    </svg>
                                </button>
                                {expanded === course.id && (
                                    <div className={styles.syllabus}>
                                        <h4>
                                            <ClipboardIcon size={14} color="var(--color-neutral-700)" />
                                            সিলেবাস:
                                        </h4>
                                        <ul>
                                            {course.syllabus.map((item, i) => (
                                                <li key={i}>
                                                    <CheckCircleIcon size={14} color="var(--color-primary-500)" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scholarship CTA */}
            <section className="section section-dark" style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 className="heading-md" style={{ color: "white", marginBottom: "var(--space-4)" }}>
                        <AwardIcon size={28} color="var(--color-accent-400)" /> স্কলারশিপ সুবিধা
                    </h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.6)", maxWidth: "600px", margin: "0 auto var(--space-4)" }}>
                        আবাসন খরচে <strong style={{ color: "var(--color-accent-400)" }}>১০০% পর্যন্ত</strong> এবং
                        টিউশন ফি-তে <strong style={{ color: "var(--color-accent-400)" }}>৮০% পর্যন্ত</strong> স্কলারশিপ
                    </p>
                    <p style={{ color: "rgba(255, 255, 255, 0.45)", marginBottom: "var(--space-8)" }}>
                        মেধাবী ও সুবিধাবঞ্চিত শিক্ষার্থীদের জন্য বিশেষ ব্যবস্থা
                    </p>
                    <Link href="/contact" className="btn btn-accent btn-lg">ভর্তির জন্য যোগাযোগ করুন</Link>
                </div>
            </section>
        </>
    );
}
