"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getBlurPlaceholder } from "@/lib/image-utils";
import { PageHeader } from "@/shared/components/PageHeader";
import { Accordion, AccordionItem } from "@/shared/components/Accordion";
import {
    BriefcaseIcon, ChefHatIcon, ChartIcon, ScissorsIcon,
    ShoeIcon, CarIcon, ClockIcon, ArrowRightIcon, UsersIcon,
    CheckCircleIcon, BookIcon, AwardIcon, CalendarIcon,
    TargetIcon, GraduationIcon, ShieldCheckIcon, TrophyIcon,
    UserIcon, PlayIcon, ArrowLeftIcon, MailIcon,
    CodeIcon, WrenchIcon, LanguageIcon, VideoIcon,
} from "@/shared/components/Icons";
import styles from "./course-detail.module.css";

// ──────────── Icons ────────────

const iconMap: Record<string, (s: number, c: string) => React.ReactNode> = {
    BriefcaseIcon: (s, c) => <BriefcaseIcon size={s} color={c} />,
    ChefHatIcon: (s, c) => <ChefHatIcon size={s} color={c} />,
    ChartIcon: (s, c) => <ChartIcon size={s} color={c} />,
    ScissorsIcon: (s, c) => <ScissorsIcon size={s} color={c} />,
    ShoeIcon: (s, c) => <ShoeIcon size={s} color={c} />,
    CarIcon: (s, c) => <CarIcon size={s} color={c} />,
    CodeIcon: (s, c) => <CodeIcon size={s} color={c} />,
    WrenchIcon: (s, c) => <WrenchIcon size={s} color={c} />,
    LanguageIcon: (s, c) => <LanguageIcon size={s} color={c} />,
    VideoIcon: (s, c) => <VideoIcon size={s} color={c} />,
};

// ──────────── Types ────────────

interface CourseInstructor {
    name: string;
    role: string;
    bio: string;
    initials: string;
}

interface CourseFAQ {
    question: string;
    answer: string;
}

interface BatchData {
    batchNumber: number;
    startDate: string | null;
    endDate: string | null;
    capacity: number;
    status: string;
}

interface SyllabusModule {
    title: string;
    topics: string[];
}

interface CourseFee {
    admission: string;
    total: string | null;
    scholarship: string | null;
}

interface CourseDetailData {
    slug: string;
    title: string;
    titleEn: string | null;
    shortDesc: string;
    fullDesc: string;
    duration: string;
    type: string;
    category: string | null;
    iconName: string | null;
    color: string;
    image: string | null;
    batchInfo: string | null;
    requirements: string[];
    outcomes: string[];
    videoPreviewUrl: string | null;
    fee: CourseFee | null;
    syllabus: SyllabusModule[];
    instructors: CourseInstructor[];
    faqs: CourseFAQ[];
    batches: BatchData[];
}

interface RelatedCourse {
    slug: string;
    title: string;
    shortDesc: string;
    duration: string;
    iconName: string | null;
    color: string;
}

// ──────────── Animation ────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

// ──────────── Batch status helpers ────────────

function getBatchStatusBn(status: string): string {
    switch (status) {
        case "ONGOING": return "চলমান";
        case "UPCOMING": return "ভর্তি চলছে";
        case "COMPLETED": return "সম্পন্ন";
        default: return status;
    }
}

function getBatchStatusCss(status: string): string {
    switch (status) {
        case "ONGOING": return "status_active";
        case "UPCOMING": return "status_open";
        case "COMPLETED": return "status_done";
        default: return "status_done";
    }
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
}

// ──────────── Component ────────────

export default function CourseDetailClient({
    course,
    relatedCourses,
}: {
    course: CourseDetailData;
    relatedCourses: RelatedCourse[];
}) {
    const renderIcon = course.iconName ? iconMap[course.iconName] : null;

    return (
        <>
            <PageHeader
                badge={course.type}
                badgeIcon={renderIcon ? renderIcon(14, "var(--color-secondary-400)") : <BookIcon size={14} color="var(--color-secondary-400)" />}
                title={course.title}
                subtitle={course.fullDesc}
                breadcrumbs={[
                    { label: "কোর্সসমূহ", href: "/courses" },
                    { label: course.title },
                ]}
            />

            {/* Course Hero Image */}
            {course.image && (
                <section className={styles.courseImageSection}>
                    <div className="container">
                        <motion.div
                            className={styles.courseImageWrap}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Image
                                src={course.image}
                                alt={course.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 1200px"
                                className={styles.courseImage}
                                priority
                                placeholder="blur"
                                blurDataURL={getBlurPlaceholder(1200, 460)}
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Video Preview */}
            {course.videoPreviewUrl && (
                <section className={styles.videoSection}>
                    <div className="container">
                        <motion.div
                            className={styles.videoWrap}
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <iframe
                                src={course.videoPreviewUrl}
                                title={`${course.title} প্রিভিউ`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                allowFullScreen
                                className={styles.videoIframe}
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Stats Row */}
            <section className={styles.statsSection}>
                <div className="container">
                    <motion.div
                        className={styles.statsGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.div className={styles.statCard} variants={fadeUp}>
                            <ClockIcon size={24} color="var(--color-primary-500)" />
                            <div>
                                <strong>{course.duration}</strong>
                                <span>সময়কাল</span>
                            </div>
                        </motion.div>
                        <motion.div className={styles.statCard} variants={fadeUp}>
                            <CalendarIcon size={24} color="var(--color-primary-500)" />
                            <div>
                                <strong>{course.type}</strong>
                                <span>ধরন</span>
                            </div>
                        </motion.div>
                        <motion.div className={styles.statCard} variants={fadeUp}>
                            <UsersIcon size={24} color="var(--color-primary-500)" />
                            <div>
                                <strong>সীমিত</strong>
                                <span>আসন সংখ্যা</span>
                            </div>
                        </motion.div>
                        <motion.div className={styles.statCard} variants={fadeUp}>
                            <AwardIcon size={24} color="var(--color-accent-500)" />
                            <div>
                                <strong>{course.fee?.scholarship || "স্কলারশিপ সুবিধা"}</strong>
                                <span>স্কলারশিপ</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Success Rate Banner */}
            <section className={styles.successBanner}>
                <div className="container">
                    <div className={styles.successInner}>
                        <div className={styles.successStat}>
                            <TrophyIcon size={28} color="var(--color-accent-400)" />
                            <div>
                                <strong>৮৫%+</strong>
                                <span>গ্র্যাজুয়েটদের কর্মসংস্থান হয়েছে</span>
                            </div>
                        </div>
                        <div className={styles.successDivider} />
                        <div className={styles.successStat}>
                            <GraduationIcon size={28} color="var(--color-secondary-400)" />
                            <div>
                                <strong>NSDA</strong>
                                <span>স্বীকৃত সার্টিফিকেট প্রদান করা হয়</span>
                            </div>
                        </div>
                        <div className={styles.successDivider} />
                        <div className={styles.successStat}>
                            <ShieldCheckIcon size={28} color="var(--color-primary-400)" />
                            <div>
                                <strong>২৪/৭</strong>
                                <span>মেন্টর সাপোর্ট পাবেন</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instructor Profiles */}
            {course.instructors.length > 0 && (
                <section className={`section ${styles.instructorsSection}`}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-badge">
                                <UserIcon size={14} color="var(--color-primary-600)" />
                                প্রশিক্ষকবৃন্দ
                            </span>
                            <h2 className="heading-md">অভিজ্ঞ <span className="gradient-text">প্রশিক্ষকদের</span> তত্ত্বাবধানে</h2>
                        </div>
                        <motion.div
                            className={styles.instructorsGrid}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                        >
                            {course.instructors.map((inst, i) => (
                                <motion.div key={i} className={styles.instructorCard} variants={fadeUp}>
                                    <div className={styles.instructorAvatar} style={{ borderColor: `${course.color}40` }}>
                                        <span style={{ color: course.color }}>{inst.initials}</span>
                                    </div>
                                    <div className={styles.instructorInfo}>
                                        <h3>{inst.name}</h3>
                                        <p className={styles.instructorRole}>{inst.role}</p>
                                        <p className={styles.instructorBio}>{inst.bio}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Batch Schedule Table */}
            {course.batches.length > 0 && (
                <section className={`section ${styles.batchSection}`}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-badge">
                                <CalendarIcon size={14} color="var(--color-primary-600)" />
                                ব্যাচ সিডিউল
                            </span>
                            <h2 className="heading-md">আসন্ন <span className="gradient-text">ব্যাচসমূহ</span></h2>
                        </div>
                        <motion.div
                            className={styles.scheduleTableWrap}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <table className={styles.scheduleTable}>
                                <thead>
                                    <tr>
                                        <th>ব্যাচ</th>
                                        <th>শুরু</th>
                                        <th>সমাপ্তি</th>
                                        <th>আসন</th>
                                        <th>অবস্থা</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.batches.map((bs, i) => (
                                        <tr key={i} className={bs.status === "UPCOMING" ? styles.batchHighlight : ""}>
                                            <td><strong>ব্যাচ {bs.batchNumber}</strong></td>
                                            <td>{formatDate(bs.startDate)}</td>
                                            <td>{formatDate(bs.endDate)}</td>
                                            <td>{bs.capacity} জন</td>
                                            <td>
                                                <span className={`${styles.batchStatus} ${styles[getBatchStatusCss(bs.status)]}`}>
                                                    {getBatchStatusBn(bs.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Syllabus + Side Panel */}
            <section className={`section ${styles.syllabusSection}`}>
                <div className="container">
                    <div className={styles.twoCol}>
                        <div>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={stagger}
                            >
                                <motion.div className={styles.sectionLabel} variants={fadeUp}>
                                    <BookIcon size={15} color="var(--color-primary-600)" />
                                    <span>সিলেবাস</span>
                                </motion.div>
                                <motion.h2 className="heading-md" variants={fadeUp}>
                                    কী কী <span className="gradient-text">শিখবেন</span>
                                </motion.h2>
                                <motion.p className={styles.sectionSubtext} variants={fadeUp}>
                                    এই কোর্সের বিস্তারিত পাঠ্যক্রম ও বিষয়সমূহ
                                </motion.p>
                            </motion.div>

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={stagger}
                                style={{ marginTop: "var(--space-6)" }}
                            >
                                <Accordion>
                                    {course.syllabus.map((module, i) => (
                                        <AccordionItem
                                            key={i}
                                            title={`${i + 1}. ${module.title}`}
                                            defaultOpen={i === 0}
                                            icon={<BookIcon size={15} color="var(--color-primary-500)" />}
                                        >
                                            <ul className={styles.topicList}>
                                                {module.topics.map((topic, j) => (
                                                    <li key={j}>
                                                        <CheckCircleIcon size={14} color="var(--color-primary-500)" />
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </motion.div>
                        </div>

                        {/* Side Panel */}
                        <div className={styles.sidePanel}>
                            {/* Requirements */}
                            {course.requirements.length > 0 && (
                                <motion.div
                                    className={styles.sideCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3>
                                        <TargetIcon size={18} color="var(--color-primary-500)" />
                                        প্রয়োজনীয়তা
                                    </h3>
                                    <ul>
                                        {course.requirements.map((r, i) => (
                                            <li key={i}>
                                                <CheckCircleIcon size={14} color="var(--color-primary-400)" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Outcomes */}
                            {course.outcomes.length > 0 && (
                                <motion.div
                                    className={styles.sideCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3>
                                        <GraduationIcon size={18} color="var(--color-primary-500)" />
                                        ফলাফল ও সুবিধা
                                    </h3>
                                    <ul>
                                        {course.outcomes.map((o, i) => (
                                            <li key={i}>
                                                <CheckCircleIcon size={14} color="var(--color-secondary-600)" />
                                                {o}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Fee Info */}
                            {course.fee && (
                                <motion.div
                                    className={styles.sideCardAccent}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3>
                                        <AwardIcon size={18} color="var(--color-accent-500)" />
                                        ফি ও স্কলারশিপ
                                    </h3>
                                    <div className={styles.feeInfo}>
                                        <div>
                                            <span>ভর্তি ফি</span>
                                            <strong>{course.fee.admission}</strong>
                                        </div>
                                        {course.fee.total && (
                                            <div>
                                                <span>মোট খরচ</span>
                                                <strong>{course.fee.total}</strong>
                                            </div>
                                        )}
                                        {course.fee.scholarship && (
                                            <div>
                                                <span>স্কলারশিপ</span>
                                                <strong>{course.fee.scholarship}</strong>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Batch Info */}
                            {course.batchInfo && (
                                <motion.div
                                    className={styles.sideCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <h3>
                                        <CalendarIcon size={18} color="var(--color-primary-500)" />
                                        ব্যাচ তথ্য
                                    </h3>
                                    <p className={styles.batchText}>{course.batchInfo}</p>
                                    <div className={styles.admissionBadge}>
                                        <ShieldCheckIcon size={14} color="var(--color-secondary-500)" />
                                        ভর্তি চলছে
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Course-Specific FAQ */}
            {course.faqs.length > 0 && (
                <section className={`section ${styles.faqSection}`}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-badge">
                                <BookIcon size={14} color="var(--color-primary-600)" />
                                সাধারণ জিজ্ঞাসা
                            </span>
                            <h2 className="heading-md">এই কোর্স সম্পর্কে <span className="gradient-text">প্রশ্নোত্তর</span></h2>
                        </div>
                        <motion.div
                            className={styles.faqGrid}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                        >
                            <Accordion>
                                {course.faqs.map((faq, i) => (
                                    <AccordionItem
                                        key={i}
                                        title={faq.question}
                                        defaultOpen={i === 0}
                                        icon={<CheckCircleIcon size={15} color="var(--color-primary-500)" />}
                                    >
                                        <p className={styles.faqAnswer}>{faq.answer}</p>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className={`section section-dark ${styles.ctaSection}`}>
                <div className="container" style={{ textAlign: "center" }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.h2 className="heading-md" style={{ color: "white", marginBottom: "var(--space-4)" }} variants={fadeUp}>
                            <span className="gradient-text">{course.title}</span>-এ ভর্তি হন
                        </motion.h2>
                        <motion.p
                            style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "0 auto var(--space-8)" }}
                            variants={fadeUp}
                        >
                            আজই ভর্তি হয়ে আপনার দক্ষতার যাত্রা শুরু করুন
                        </motion.p>
                        <motion.div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }} variants={fadeUp}>
                            <Link href="/admission" className="btn btn-accent btn-lg">
                                <ArrowRightIcon size={16} color="var(--color-dark-bg)" />
                                এখনই ভর্তি হন
                            </Link>
                            <Link href="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: "white", color: "white" }}>
                                যোগাযোগ করুন
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
                <section className={`section ${styles.relatedSection}`}>
                    <div className="container">
                        <h2 className="heading-md" style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
                            সম্পর্কিত <span className="gradient-text">কোর্সসমূহ</span>
                        </h2>
                        <div className={styles.relatedGrid}>
                            {relatedCourses.map((rc) => {
                                const rcIcon = rc.iconName ? iconMap[rc.iconName] : null;
                                return (
                                    <Link key={rc.slug} href={`/courses/${rc.slug}`} className={styles.relatedCard}>
                                        <div className={styles.relatedCardIcon} style={{ background: `${rc.color}10`, borderColor: `${rc.color}22` }}>
                                            {rcIcon ? rcIcon(24, rc.color) : null}
                                        </div>
                                        <h3>{rc.title}</h3>
                                        <p>{rc.shortDesc}</p>
                                        <span className={styles.relatedCardMeta}>
                                            <ClockIcon size={13} color="var(--color-neutral-400)" />
                                            {rc.duration}
                                            <ArrowRightIcon size={13} color="var(--color-primary-500)" />
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
