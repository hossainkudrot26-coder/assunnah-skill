"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import {
    ClipboardIcon, CheckCircleIcon, ArrowRightIcon,
    UserIcon, BookIcon, PhoneIcon, AwardIcon,
} from "@/shared/components/Icons";
import styles from "./admission.module.css";
import type { AdmissionData } from "./page";

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
    visible: { transition: { staggerChildren: 0.12 } },
};

/* ═══════════════════════════════════════════
   ICON MAP (for serializable icon keys)
   ═══════════════════════════════════════════ */

const iconMap: Record<string, React.ReactNode> = {
    book: <BookIcon size={24} color="white" />,
    phone: <PhoneIcon size={24} color="white" />,
    clipboard: <ClipboardIcon size={24} color="white" />,
    user: <UserIcon size={24} color="white" />,
    check: <CheckCircleIcon size={24} color="white" />,
    award: <AwardIcon size={24} color="white" />,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

interface AdmissionClientProps {
    data: AdmissionData;
}

export default function AdmissionClient({ data }: AdmissionClientProps) {
    return (
        <>
            <PageHeader
                title="ভর্তি প্রক্রিয়া"
                subtitle="ধাপে ধাপে জানুন কিভাবে আমাদের কোর্সে ভর্তি হবেন"
                breadcrumbs={[
                    { label: "হোম", href: "/" },
                    { label: "ভর্তি প্রক্রিয়া" },
                ]}
                badge={{ icon: <ClipboardIcon size={14} color="var(--color-secondary-300)" />, text: "ভর্তি তথ্য" }}
            />

            {/* Steps — Vertical Timeline */}
            <section className={styles.stepsSection}>
                <div className="container">
                    <motion.div
                        className={styles.sectionHeader}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease }}
                    >
                        <h2>ভর্তির ধাপসমূহ</h2>
                        <p>{data.steps.length}টি সহজ ধাপে আপনার প্রশিক্ষণ শুরু করুন</p>
                    </motion.div>

                    <motion.div
                        className={styles.timeline}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <div className={styles.timelineLine} />
                        {data.steps.map((step, i) => (
                            <motion.div
                                key={i}
                                className={`${styles.timelineItem} ${i % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}
                                variants={fadeUp}
                            >
                                <div className={styles.timelineDot} style={{ background: step.color }}>
                                    <span>{step.number}</span>
                                </div>
                                <div className={styles.timelineCard}>
                                    <div className={styles.cardIconWrap} style={{ background: step.color }}>
                                        {iconMap[step.iconKey] || iconMap.check}
                                    </div>
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Documents */}
            <section className={styles.docsSection}>
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.div className={styles.sectionHeader} variants={fadeUp}>
                            <h2>প্রয়োজনীয় কাগজপত্র</h2>
                            <p>ভর্তির সময় নিচের কাগজপত্রগুলো সাথে আনুন</p>
                        </motion.div>
                        <motion.div className={styles.docsGrid} variants={fadeUp}>
                            {data.documents.map((doc, i) => (
                                <div key={i} className={styles.docItem}>
                                    <div className={styles.docCheck}>
                                        <CheckCircleIcon size={18} color="var(--color-primary-500)" />
                                    </div>
                                    <span>{doc}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <motion.div
                        className={styles.ctaCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease }}
                    >
                        <AwardIcon size={36} color="var(--color-accent-400)" />
                        <h2>এখনই আবেদন করুন</h2>
                        <p>আমাদের যেকোনো কোর্সে ভর্তির জন্য এখনই যোগাযোগ করুন। আসন সীমিত!</p>
                        <div className={styles.ctaActions}>
                            <Link href="/admission/apply" className={styles.ctaPrimary}>
                                অনলাইন আবেদন করুন
                                <ArrowRightIcon size={15} color="white" />
                            </Link>
                            <a href="tel:+8809610001089" className={styles.ctaPhone}>
                                <PhoneIcon size={16} color="rgba(255,255,255,0.8)" />
                                +৮৮০ ৯৬১০-০০১০৮৯
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
