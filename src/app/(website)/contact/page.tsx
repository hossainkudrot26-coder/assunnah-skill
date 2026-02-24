"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import {
  PhoneIcon, MapPinIcon, MailIcon, ClockIcon, SendIcon,
  CheckCircleIcon, LockIcon,
} from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import styles from "./contact.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

const infoCards = [
  {
    icon: <MapPinIcon size={22} color="var(--color-primary-500)" />,
    title: "ঠিকানা",
    lines: [siteConfig.contact.address],
  },
  {
    icon: <PhoneIcon size={22} color="var(--color-primary-500)" />,
    title: "ফোন",
    lines: [siteConfig.contact.phone, siteConfig.contact.phone2],
  },
  {
    icon: <MailIcon size={22} color="var(--color-primary-500)" />,
    title: "ইমেইল",
    lines: [siteConfig.contact.email],
  },
  {
    icon: <ClockIcon size={22} color="var(--color-primary-500)" />,
    title: "কার্যদিবস",
    lines: ["শনিবার — বৃহস্পতিবার", "সকাল ৯:০০ — বিকাল ৫:০০"],
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <PageHeader
        title="আমাদের সাথে যোগাযোগ করুন"
        subtitle="কোর্স, ভর্তি বা অন্য যেকোনো বিষয়ে জানতে আমাদের সাথে যোগাযোগ করুন"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "যোগাযোগ" },
        ]}
        badge={{ icon: <PhoneIcon size={14} color="var(--color-secondary-300)" />, text: "যোগাযোগ" }}
      />

      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <motion.div
              className={styles.formWrapper}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h2 className={styles.formTitle}>মেসেজ পাঠান</h2>
              <p className={styles.formSubtitle}>ফর্মটি পূরণ করুন, আমরা শীঘ্রই উত্তর দেবো</p>
              {submitted ? (
                <motion.div
                  className={styles.successMessage}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <div className={styles.successIconWrap}>
                    <CheckCircleIcon size={48} color="var(--color-primary-500)" />
                  </div>
                  <h3>ধন্যবাদ!</h3>
                  <p>আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">আপনার নাম *</label>
                      <input type="text" id="name" placeholder="পূর্ণ নাম লিখুন" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">ফোন নম্বর *</label>
                      <input type="tel" id="phone" placeholder="০১XXXXXXXXX" required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">ইমেইল</label>
                    <input type="email" id="email" placeholder="your@email.com" />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">বিষয়</label>
                    <select id="subject">
                      <option value="">বিষয় নির্বাচন করুন</option>
                      <option value="admission">ভর্তি সংক্রান্ত</option>
                      <option value="courses">কোর্স সম্পর্কে</option>
                      <option value="scholarship">স্কলারশিপ</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message">বিস্তারিত *</label>
                    <textarea id="message" rows={5} placeholder="আপনার বার্তা লিখুন..." required />
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    <SendIcon size={18} color="white" />
                    মেসেজ পাঠান
                  </button>
                  <p className={styles.formSecurityNote}>
                    <LockIcon size={13} color="var(--color-neutral-400)" />
                    আপনার তথ্য সম্পূর্ণ নিরাপদ
                  </p>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              {infoCards.map((card, i) => (
                <motion.div
                  key={i}
                  className={styles.infoCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i, ease }}
                >
                  <div className={styles.infoIconWrap}>{card.icon}</div>
                  <div>
                    <h3>{card.title}</h3>
                    {card.lines.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Google Map */}
              <div className={styles.mapWrapper}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0!2d90.43!3d23.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzA1LjIiTiA5MMKwMjUnNDYuNCJF!5e0!3m2!1sbn!2sbd!4v1700000000000"
                  width="100%"
                  height="220"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen
                  loading="lazy"
                  title="আস-সুন্নাহ স্কিলের অবস্থান"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
