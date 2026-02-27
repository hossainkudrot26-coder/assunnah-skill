"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import {
    AwardIcon, CheckCircleIcon, ArrowRightIcon, UsersIcon,
    ShieldCheckIcon, HeartIcon, GraduationIcon, PhoneIcon,
} from "@/shared/components/Icons";
import styles from "./scholarship.module.css";
import type { ScholarshipData } from "./page";

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

/* ═══════════════════════════════════════════
   ICON MAP (for serializable icon keys)
   ═══════════════════════════════════════════ */

const iconMap: Record<string, React.ReactNode> = {
    heart: <HeartIcon size={28} color="var(--color-primary-500)" />,
    graduation: <GraduationIcon size={28} color="var(--color-primary-500)" />,
    award: <AwardIcon size={28} color="var(--color-accent-500)" />,
    shield: <ShieldCheckIcon size={28} color="var(--color-primary-500)" />,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

interface ScholarshipClientProps {
    data: ScholarshipData;
}

export default function ScholarshipClient({ data }: ScholarshipClientProps) {
    return (
        <>
            <PageHeader
                badge="স্কলারশিপ"
                badgeIcon={<AwardIcon size={14} color="var(--color-secondary-400)" />}
                title="স্কলারশিপ"
                titleHighlight="সুবিধা"
                subtitle="মেধাবী ও সুবিধাবঞ্চিত শিক্ষার্থীদের জন্য বিশেষ স্কলারশিপ ব্যবস্থা"
                breadcrumbs={[{ label: "স্কলারশিপ" }]}
            />

            {/* Types */}
            <section className={`section ${styles.typesSection}`}>
                <div className="container">
                    <motion.div
                        className={styles.typesGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {data.types.map((t, i) => (
                            <motion.div key={i} className={styles.typeCard} variants={fadeUp}>
                                <div className={styles.typeIcon}>
                                    {iconMap[t.iconKey] || iconMap.award}
                                </div>
                                <h3>{t.title}</h3>
                                <div className={styles.typePercentage}>{t.percentage} পর্যন্ত</div>
                                <p>{t.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Eligibility */}
            <section className="section section-dark">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.div className="section-badge section-badge-dark" variants={fadeUp}>
                            <UsersIcon size={14} color="var(--color-secondary-400)" />
                            যোগ্যতা
                        </motion.div>
                        <motion.h2 className="heading-md" variants={fadeUp}>
                            কারা <span className="gradient-text">আবেদন করতে পারবেন</span>
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        className={styles.eligibilityGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {data.eligibility.map((item, i) => (
                            <motion.div key={i} className={styles.eligibilityCard} variants={fadeUp}>
                                <CheckCircleIcon size={20} color="var(--color-secondary-400)" />
                                <span>{item}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Application Process */}
            <section className="section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.div className="section-badge" variants={fadeUp}>
                            <ShieldCheckIcon size={14} color="var(--color-primary-600)" />
                            আবেদন প্রক্রিয়া
                        </motion.div>
                        <motion.h2 className="heading-md" variants={fadeUp}>
                            কিভাবে <span className="gradient-text">আবেদন করবেন</span>
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        className={styles.processSteps}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {data.applicationSteps.map((step, i) => (
                            <motion.div key={i} className={styles.processStep} variants={fadeUp}>
                                <div className={styles.processStepNum}>{i + 1}</div>
                                <p>{step}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        style={{ textAlign: "center", marginTop: "var(--space-12)" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/contact" className="btn btn-primary btn-lg">
                            <PhoneIcon size={16} color="white" />
                            আবেদনের জন্য যোগাযোগ করুন
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
