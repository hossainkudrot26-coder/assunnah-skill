import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
    TargetIcon, MosqueIcon, GlobeIcon, BalanceIcon, TrophyIcon, HeartIcon,
    MonitorIcon, BuildingIcon, UsersIcon, MapPinIcon, CalendarIcon,
    ShieldCheckIcon, UserIcon, BookIcon, ArrowRightIcon, GraduationIcon,
    ChefHatIcon, ChartIcon, ScissorsIcon, AwardIcon,
} from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import { AnimatedSection, AnimatedItem } from "@/shared/components/AnimatedSection";
import styles from "./about.module.css";

export const metadata: Metadata = {
    title: "আমাদের সম্পর্কে",
    description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট — শায়খ আহমাদুল্লাহ কর্তৃক প্রতিষ্ঠিত দক্ষতা বৃদ্ধিমূলক প্রতিষ্ঠান",
};

const timeline = [
    { year: "২০১৭", title: "আস-সুন্নাহ ফাউন্ডেশন প্রতিষ্ঠা", desc: "শায়খ আহমাদুল্লাহ কর্তৃক মানবকল্যাণ ও সমাজ সংস্কারের লক্ষ্যে প্রতিষ্ঠিত", icon: <MosqueIcon size={18} color="white" /> },
    { year: "২০২২", title: "স্কিল ডেভেলপমেন্ট ইনস্টিটিউট চালু", desc: "বেকারত্ব দূরীকরণ ও দক্ষ জনশক্তি তৈরির লক্ষ্যে প্রশিক্ষণ কার্যক্রম শুরু", icon: <GraduationIcon size={18} color="white" /> },
    { year: "২০২৩", title: "NSDA নিবন্ধন অর্জন", desc: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ কর্তৃক আনুষ্ঠানিক নিবন্ধন", icon: <AwardIcon size={18} color="white" /> },
    { year: "২০২৪", title: "১০,০০০+ অনলাইন শিক্ষার্থী", desc: "ওয়েব ডেভেলপমেন্ট বুটক্যাম্পের প্রথম ব্যাচে ১০,৯৬২ জন অংশগ্রহণ", icon: <UsersIcon size={18} color="white" /> },
    { year: "২০২৫", title: "নতুন শেড নির্মাণ ও সম্প্রসারণ", desc: "৩২,৫০০ বর্গফুটের নতুন ব্রাঞ্চ নির্মাণ চলমান", icon: <BuildingIcon size={18} color="white" /> },
];

const values = [
    { icon: <TargetIcon size={28} color="var(--color-primary-500)" />, title: "লক্ষ্য", desc: "বাংলাদেশের বেকার যুবক-যুবতীদের দক্ষ জনশক্তি হিসেবে গড়ে তোলা" },
    { icon: <MosqueIcon size={28} color="var(--color-primary-500)" />, title: "সততা", desc: "ইসলামী মূল্যবোধের আলোকে সৎ ও দক্ষ পেশাদার তৈরি" },
    { icon: <GlobeIcon size={28} color="var(--color-primary-500)" />, title: "সামাজিক প্রভাব", desc: "দরিদ্রতা বিমোচন ও আর্থিক সচ্ছলতা নিশ্চিতকরণ" },
    { icon: <BalanceIcon size={28} color="var(--color-primary-500)" />, title: "সমতা", desc: "নারী ও পুরুষ উভয়ের জন্য সম-সুযোগ ও পৃথক পরিবেশে প্রশিক্ষণ" },
    { icon: <TrophyIcon size={28} color="var(--color-accent-500)" />, title: "শ্রেষ্ঠত্ব", desc: "ইন্ডাস্ট্রি-স্ট্যান্ডার্ড প্রশিক্ষণ ও সর্বোচ্চ মানের পাঠক্রম" },
    { icon: <HeartIcon size={28} color="var(--color-primary-500)" />, title: "কল্যাণ", desc: "মেধাবী ও সুবিধাবঞ্চিতদের জন্য সম্পূর্ণ বিনামূল্যে প্রশিক্ষণ" },
];

const facilities = [
    { number: "৭", label: "কম্পিউটার ল্যাব", icon: <MonitorIcon size={28} color="var(--color-primary-500)" /> },
    { number: "২৪,০০০", label: "বর্গফুট প্রশিক্ষণ কেন্দ্র", icon: <BuildingIcon size={28} color="var(--color-primary-500)" /> },
    { number: "২,৫০০+", label: "প্রশিক্ষিত জনশক্তি", icon: <UsersIcon size={28} color="var(--color-primary-500)" /> },
    { number: "১০+", label: "চলমান কোর্স", icon: <BookIcon size={28} color="var(--color-accent-500)" /> },
];

const teamMembers = [
    { name: "শায়খ আহমাদুল্লাহ", role: "প্রতিষ্ঠাতা ও চেয়ারম্যান", initials: "শআ", color: "#1B8A50", desc: "আস-সুন্নাহ ফাউন্ডেশনের প্রতিষ্ঠাতা, দূরদর্শী নেতৃত্ব" },
    { name: "মুহাম্মদ রাশেদুল ইসলাম", role: "পরিচালক — প্রশিক্ষণ বিভাগ", initials: "মরই", color: "#1565C0", desc: "১০+ বছরের শিক্ষা ও প্রশিক্ষণ অভিজ্ঞতা" },
    { name: "শেফ আব্দুর রহমান", role: "প্রধান প্রশিক্ষক — রন্ধনশিল্প", initials: "আর", color: "#E65100", desc: "৫-তারকা হোটেলে ১৫+ বছরের অভিজ্ঞতা" },
    { name: "তানভীর আহমেদ", role: "প্রধান প্রশিক্ষক — সেলস ও মার্কেটিং", initials: "তআ", color: "#7B1FA2", desc: "কর্পোরেট সেলস ম্যানেজার, ১২+ বছরের অভিজ্ঞতা" },
    { name: "আহমদ ফয়সাল", role: "প্রশিক্ষক — অ্যাকাউন্টিং", initials: "আফ", color: "#2E7D32", desc: "চার্টার্ড অ্যাকাউন্ট্যান্ট, কর্পোরেট ট্রেইনার" },
    { name: "নাদিম হাসান", role: "প্রশিক্ষক — ভিডিও ও AI", initials: "নহ", color: "#C62828", desc: "ইউটিউব কনটেন্ট ক্রিয়েটর, AI বিশেষজ্ঞ" },
];

export default function AboutPage() {
    return (
        <>
            <PageHeader
                title="আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট"
                subtitle="আস-সুন্নাহ ফাউন্ডেশনের অধীনে পরিচালিত দক্ষতা বৃদ্ধি ও আত্মোন্নয়নের প্রতিষ্ঠান"
                breadcrumbs={[
                    { label: "হোম", href: "/" },
                    { label: "আমাদের সম্পর্কে" },
                ]}
                badge={{ icon: <BuildingIcon size={14} color="var(--color-secondary-300)" />, text: "আমাদের সম্পর্কে" }}
            />

            {/* Founder Section */}
            <section className={`section ${styles.founderSection}`}>
                <div className="container">
                    <div className={styles.founderGrid}>
                        <div className={styles.founderContent}>
                            <span className="section-badge">
                                <UserIcon size={14} color="var(--color-primary-600)" />
                                প্রতিষ্ঠাতা
                            </span>
                            <h2 className="heading-md">শায়খ আহমাদুল্লাহ</h2>
                            <p className={styles.founderText}>
                                আস-সুন্নাহ ফাউন্ডেশনের প্রতিষ্ঠাতা শায়খ আহমাদুল্লাহ ২০১৭ সালে এই ফাউন্ডেশন
                                প্রতিষ্ঠা করেন। মানবকল্যাণ, সমাজ সংস্কার এবং রাসূল (সা.) এর আদর্শে একটি
                                কল্যাণমূলক সমাজ গঠনের লক্ষ্যে কাজ করে যাচ্ছে এই ফাউন্ডেশন।
                            </p>
                            <p className={styles.founderText}>
                                তাঁর দূরদর্শী নেতৃত্বে ২০২২ সালে আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট
                                প্রতিষ্ঠিত হয়, যার লক্ষ্য হলো বাংলাদেশের বেকার যুবক-যুবতীদের কম্পিউটার ও
                                কারিগরি প্রশিক্ষণের মাধ্যমে দক্ষ জনশক্তি হিসেবে গড়ে তোলা।
                            </p>
                            <div className={styles.founderQuote}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-primary-300)">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                                </svg>
                                <blockquote>
                                    আমরা চাই, বাংলাদেশের প্রতিটি বেকার যুবক-যুবতী একটি দক্ষতা অর্জন করুক
                                    এবং আত্মনির্ভরশীল হয়ে উঠুক।
                                </blockquote>
                            </div>
                        </div>
                        <div className={styles.founderVisual}>
                            <div className={styles.founderCard}>
                                <div className={styles.founderAvatar}>
                                    <span className={styles.founderAvatarInitials}>শআ</span>
                                </div>
                                <h3>শায়খ আহমাদুল্লাহ</h3>
                                <p>প্রতিষ্ঠাতা, আস-সুন্নাহ ফাউন্ডেশন</p>
                                <div className={styles.founderStats}>
                                    <div>
                                        <strong>২০১৭</strong>
                                        <span>ফাউন্ডেশন প্রতিষ্ঠা</span>
                                    </div>
                                    <div>
                                        <strong>২০২২</strong>
                                        <span>ইনস্টিটিউট চালু</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className={`section ${styles.missionSection}`}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIconBox}>
                                <TargetIcon size={32} color="var(--color-primary-500)" />
                            </div>
                            <h3>আমাদের লক্ষ্য</h3>
                            <p>
                                {siteConfig.mission}
                            </p>
                        </div>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIconBox}>
                                <GlobeIcon size={32} color="var(--color-accent-500)" />
                            </div>
                            <h3>আমাদের ভিশন</h3>
                            <p>
                                {siteConfig.vision}
                            </p>
                        </div>
                    </div>
                    <div className={styles.orgTypeBox}>
                        <ShieldCheckIcon size={18} color="var(--color-primary-500)" />
                        <span>{siteConfig.orgType} — {siteConfig.registration}</span>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={`section section-dark`}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge section-badge-dark">
                            <ShieldCheckIcon size={14} color="var(--color-secondary-400)" />
                            আমাদের মূল্যবোধ
                        </span>
                        <h2 className="heading-md">যে নীতিতে আমরা <span className="gradient-text">চলি</span></h2>
                    </div>
                    <AnimatedSection className={styles.valuesGrid}>
                        {values.map((v, i) => (
                            <AnimatedItem key={i} className={styles.valueCard}>
                                <div className={styles.valueIconBox}>{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </AnimatedItem>
                        ))}
                    </AnimatedSection>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">
                            <CalendarIcon size={14} color="var(--color-primary-600)" />
                            আমাদের যাত্রা
                        </span>
                        <h2 className="heading-md">প্রতিষ্ঠা থেকে <span className="gradient-text">আজ পর্যন্ত</span></h2>
                    </div>
                    <div className={styles.timeline}>
                        {timeline.map((item, i) => (
                            <div key={i} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}>
                                <div className={styles.timelineDot}>
                                    {item.icon}
                                </div>
                                <div className={styles.timelineCard}>
                                    <span className={styles.timelineYear}>{item.year}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section className={`section ${styles.facilitiesSection}`}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">
                            <BuildingIcon size={14} color="var(--color-primary-600)" />
                            আমাদের সুবিধাসমূহ
                        </span>
                        <h2 className="heading-md">আধুনিক <span className="gradient-text">অবকাঠামো</span></h2>
                    </div>
                    <AnimatedSection className={styles.facilitiesGrid}>
                        {facilities.map((f, i) => (
                            <AnimatedItem key={i} className={styles.facilityCard}>
                                <div className={styles.facilityIconBox}>{f.icon}</div>
                                <span className={styles.facilityNumber}>{f.number}</span>
                                <span className={styles.facilityLabel}>{f.label}</span>
                            </AnimatedItem>
                        ))}
                    </AnimatedSection>
                    <div className={styles.facilityInfo}>
                        <div className={styles.facilityInfoCard}>
                            <div className={styles.facilityInfoIcon}>
                                <MapPinIcon size={22} color="var(--color-primary-500)" />
                            </div>
                            <h3>অবস্থান</h3>
                            <p>{siteConfig.contact.address}</p>
                        </div>
                        <div className={styles.facilityInfoCard}>
                            <div className={styles.facilityInfoIcon}>
                                <TargetIcon size={22} color="var(--color-primary-500)" />
                            </div>
                            <h3>লক্ষ্য</h3>
                            <p>স্থায়ী ও বৃহৎ প্রশিক্ষণ কেন্দ্র নির্মাণ — বছরে ১ লক্ষ দক্ষ জনশক্তি তৈরি</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team / Faculty Grid */}
            <section className={`section ${styles.teamSection}`}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">
                            <UsersIcon size={14} color="var(--color-primary-600)" />
                            আমাদের টিম
                        </span>
                        <h2 className="heading-md">অভিজ্ঞ <span className="gradient-text">প্রশিক্ষক ও পরিচালকবৃন্দ</span></h2>
                        <p style={{ color: "var(--color-neutral-500)", maxWidth: 600, margin: "var(--space-3) auto 0" }}>
                            দক্ষ ও অভিজ্ঞ পেশাদারদের তত্ত্বাবধানে পরিচালিত হয় আমাদের সকল কার্যক্রম
                        </p>
                    </div>
                    <AnimatedSection className={styles.teamGrid}>
                        {teamMembers.map((member, i) => (
                            <AnimatedItem key={i} className={styles.teamCard}>
                                <div className={styles.teamAvatar} style={{ borderColor: `${member.color}40` }}>
                                    <span style={{ color: member.color, fontWeight: 800, fontSize: "1rem" }}>{member.initials}</span>
                                </div>
                                <h3 className={styles.teamName}>{member.name}</h3>
                                <p className={styles.teamRole}>{member.role}</p>
                                <p className={styles.teamDesc}>{member.desc}</p>
                            </AnimatedItem>
                        ))}
                    </AnimatedSection>
                    <p className={styles.teamNote}>
                        <UserIcon size={14} color="var(--color-neutral-400)" />
                        প্রশিক্ষকদের ছবি শীঘ্রই যুক্ত করা হবে
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className={`section section-dark`} style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 className="heading-md" style={{ color: "white", marginBottom: "var(--space-4)" }}>
                        আমাদের সাথে যুক্ত হন
                    </h2>
                    <p style={{ color: "var(--color-neutral-400)", maxWidth: "500px", margin: "0 auto var(--space-8)" }}>
                        দক্ষতা অর্জন করে আত্মনির্ভরশীল হয়ে উঠুন
                    </p>
                    <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/courses" className="btn btn-primary btn-lg">কোর্সসমূহ দেখুন</Link>
                        <Link href="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: "white", color: "white" }}>যোগাযোগ</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
