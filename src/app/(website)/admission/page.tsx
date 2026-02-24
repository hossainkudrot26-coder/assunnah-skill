"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  ClipboardIcon, CheckCircleIcon, ArrowRightIcon, CalendarIcon,
  UserIcon, BookIcon, PhoneIcon, AwardIcon,
} from "@/shared/components/Icons";
import styles from "./admission.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const steps = [
  { number: "০১", title: "কোর্স নির্বাচন", desc: "আমাদের ওয়েবসাইট থেকে আপনার পছন্দের কোর্সটি দেখুন এবং বিস্তারিত জানুন।", icon: <BookIcon size={24} color="var(--color-primary-500)" /> },
  { number: "০২", title: "যোগাযোগ", desc: "ফোন বা ইমেইলে আমাদের সাথে যোগাযোগ করুন। ভর্তি সংক্রান্ত বিস্তারিত জানুন।", icon: <PhoneIcon size={24} color="var(--color-primary-500)" /> },
  { number: "০৩", title: "আবেদন ও ডকুমেন্ট", desc: "প্রয়োজনীয় কাগজপত্রসহ আবেদন ফর্ম পূরণ করুন এবং জমা দিন।", icon: <ClipboardIcon size={24} color="var(--color-primary-500)" /> },
  { number: "০৪", title: "সাক্ষাৎকার", desc: "একটি সংক্ষিপ্ত সাক্ষাৎকারে অংশগ্রহণ করুন। আপনার আগ্রহ ও যোগ্যতা যাচাই করা হবে।", icon: <UserIcon size={24} color="var(--color-primary-500)" /> },
  { number: "০৫", title: "ভর্তি নিশ্চিতকরণ", desc: "নির্বাচিত হলে ভর্তি নিশ্চিত করুন। স্কলারশিপের জন্য আলাদা মূল্যায়ন হবে।", icon: <CheckCircleIcon size={24} color="var(--color-secondary-600)" /> },
];

const documents = [
  "জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন সনদ",
  "সর্বশেষ শিক্ষাগত সনদের ফটোকপি",
  "পাসপোর্ট সাইজ ছবি (২ কপি)",
  "অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি",
  "স্থানীয় চেয়ারম্যান / কাউন্সিলর প্রত্যয়নপত্র",
];

export default function AdmissionPage() {
  return (
    <>
      <PageHeader
        title="ভর্তি প্রক্রিয়া"
        subtitle="ধাপে ধাপে জানুন কিভাবে আমাদের কোর্সে ভর্তি হবেন"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "ভর্তি প্রক্রিয়া" },
        ]}
        badge="ভর্তি তথ্য"
        badgeIcon={<ClipboardIcon size={14} color="var(--color-secondary-400)" />}
      />

      {/* Steps */}
      <section className={styles.stepsSection}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 className={styles.stepsTitle} variants={fadeUp}>ভর্তির ধাপসমূহ</motion.h2>
            <div className={styles.stepsGrid}>
              {steps.map((step, i) => (
                <motion.div key={i} className={styles.stepCard} variants={fadeUp}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documents */}
      <section className={styles.docsSection}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 className={styles.docsTitle} variants={fadeUp}>প্রয়োজনীয় কাগজপত্র</motion.h2>
            <motion.div className={styles.docsList} variants={fadeUp}>
              {documents.map((doc, i) => (
                <div key={i} className={styles.docItem}>
                  <CheckCircleIcon size={20} color="var(--color-primary-500)" />
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
            <h2>এখনই আবেদন করুন</h2>
            <p>আমাদের যেকোনো কোর্সে ভর্তির জন্য এখনই যোগাযোগ করুন। আসন সীমিত!</p>
            <div className={styles.ctaActions}>
              <Link href="/courses" className={styles.ctaPrimary}>
                কোর্স দেখুন
                <ArrowRightIcon size={15} color="white" />
              </Link>
              <a href="tel:+8809610001089" className={styles.ctaPhone}>
                <PhoneIcon size={16} color="rgba(255,255,255,0.7)" />
                +৮৮০ ৯৬১০-০০১০৮৯
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
