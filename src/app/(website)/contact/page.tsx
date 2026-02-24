"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { PhoneIcon, MapPinIcon, MailIcon, ClockIcon, SendIcon, CheckCircleIcon, LockIcon } from "@/shared/components/Icons";
import styles from "./contact.module.css";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className={styles.pageHeaderBg} />
                <div className={`container ${styles.pageHeaderContent}`}>
                    <span className="section-badge section-badge-dark">
                        <PhoneIcon size={14} color="var(--color-secondary-400)" />
                        যোগাযোগ
                    </span>
                    <h1 className="heading-lg" style={{ color: "white" }}>
                        আমাদের সাথে <span className="gradient-text">যোগাযোগ করুন</span>
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "600px", fontSize: "var(--text-lg)" }}>
                        কোর্স, ভর্তি বা অন্য যেকোনো বিষয়ে জানতে আমাদের সাথে যোগাযোগ করুন
                    </p>
                </div>
            </section>

            <section className={`section ${styles.contactSection}`}>
                <div className="container">
                    <div className={styles.contactGrid}>
                        {/* Contact Form */}
                        <div className={styles.formWrapper}>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-6)" }}>
                                মেসেজ পাঠান
                            </h2>
                            {submitted ? (
                                <div className={styles.successMessage}>
                                    <div className={styles.successIconWrap}>
                                        <CheckCircleIcon size={40} color="var(--color-primary-500)" />
                                    </div>
                                    <h3>ধন্যবাদ!</h3>
                                    <p>আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
                                </div>
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
                                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>
                                        <SendIcon size={18} color="white" />
                                        মেসেজ পাঠান
                                    </button>
                                    <p className={styles.formSecurityNote}>
                                        <LockIcon size={13} color="var(--color-neutral-400)" />
                                        আপনার তথ্য সম্পূর্ণ নিরাপদ
                                    </p>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className={styles.contactInfo}>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIconWrap}>
                                    <MapPinIcon size={22} color="var(--color-primary-500)" />
                                </div>
                                <h3>ঠিকানা</h3>
                                <p>{siteConfig.contact.address}</p>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIconWrap}>
                                    <PhoneIcon size={22} color="var(--color-primary-500)" />
                                </div>
                                <h3>ফোন</h3>
                                <p>{siteConfig.contact.phone}</p>
                                <p>{siteConfig.contact.phone2}</p>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIconWrap}>
                                    <MailIcon size={22} color="var(--color-primary-500)" />
                                </div>
                                <h3>ইমেইল</h3>
                                <p>{siteConfig.contact.email}</p>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIconWrap}>
                                    <ClockIcon size={22} color="var(--color-primary-500)" />
                                </div>
                                <h3>কার্যদিবস</h3>
                                <p>শনিবার — বৃহস্পতিবার</p>
                                <p>সকাল ৯:০০ — বিকাল ৫:০০</p>
                            </div>

                            {/* Map Embed */}
                            <div className={styles.mapWrapper}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0!2d90.43!3d23.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzA1LjIiTiA5MMKwMjUnNDYuNCJF!5e0!3m2!1sbn!2sbd!4v1700000000000"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0, borderRadius: "var(--radius-xl)" }}
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
