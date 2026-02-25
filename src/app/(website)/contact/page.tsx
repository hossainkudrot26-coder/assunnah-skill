"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import {
  PhoneIcon, MapPinIcon, MailIcon, ClockIcon, SendIcon,
  CheckCircleIcon, LockIcon,
} from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import { submitContactForm } from "@/lib/actions/contact";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value || "",
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value || "",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "সমস্যা হয়েছে");
      }
    } catch {
      setError("বার্তা পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
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
                  {error && (
                    <div style={{
                      padding: "12px 16px",
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                      borderRadius: "10px",
                      color: "#DC2626",
                      fontSize: "0.85rem",
                      marginBottom: "16px",
                    }}>
                      {error}
                    </div>
                  )}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">আপনার নাম *</label>
                      <input type="text" id="name" name="name" placeholder="পূর্ণ নাম লিখুন" required disabled={loading} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">ফোন নম্বর *</label>
                      <input type="tel" id="phone" name="phone" placeholder="০১XXXXXXXXX" required disabled={loading} />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">ইমেইল</label>
                    <input type="email" id="email" name="email" placeholder="your@email.com" disabled={loading} />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">বিষয়</label>
                    <select id="subject" name="subject" disabled={loading}>
                      <option value="">বিষয় নির্বাচন করুন</option>
                      <option value="ভর্তি সংক্রান্ত">ভর্তি সংক্রান্ত</option>
                      <option value="কোর্স সম্পর্কে">কোর্স সম্পর্কে</option>
                      <option value="স্কলারশিপ">স্কলারশিপ</option>
                      <option value="অন্যান্য">অন্যান্য</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message">বিস্তারিত *</label>
                    <textarea id="message" name="message" rows={5} placeholder="আপনার বার্তা লিখুন..." required disabled={loading} />
                  </div>
                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? (
                      <>
                        <span style={{
                          width: 18, height: 18,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite",
                          display: "inline-block",
                        }} />
                        পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        <SendIcon size={18} color="white" />
                        মেসেজ পাঠান
                      </>
                    )}
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.2!2d90.4280!3d23.7808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0d2c6b9e9%3A0x1!2sUttar%20Badda%2C%20Dhaka!5e0!3m2!1sbn!2sbd!4v1700000000000"
                  width="100%"
                  height="220"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen
                  loading="lazy"
                  title="আস-সুন্নাহ স্কিলের অবস্থান — উত্তর বাড্ডা, ঢাকা"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
