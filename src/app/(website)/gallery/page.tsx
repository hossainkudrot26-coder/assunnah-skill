"use client";

import { useState } from "react";
import type { Metadata } from "next";
import {
    MonitorIcon, GraduationIcon, ScissorsIcon, MicIcon, ChefHatIcon,
    BuildingIcon, HandshakeIcon, CarIcon, PartyIcon, ImageIcon, CameraIcon,
} from "@/shared/components/Icons";
import styles from "./gallery.module.css";

const galleryIcons: Record<string, React.ReactNode> = {
    monitor: <MonitorIcon size={40} color="currentColor" />,
    graduation: <GraduationIcon size={40} color="currentColor" />,
    scissors: <ScissorsIcon size={40} color="currentColor" />,
    mic: <MicIcon size={40} color="currentColor" />,
    chef: <ChefHatIcon size={40} color="currentColor" />,
    building: <BuildingIcon size={40} color="currentColor" />,
    handshake: <HandshakeIcon size={40} color="currentColor" />,
    car: <CarIcon size={40} color="currentColor" />,
    party: <PartyIcon size={40} color="currentColor" />,
};

const galleryItems = [
    { id: 1, category: "ক্লাসরুম", iconKey: "monitor", title: "কম্পিউটার ল্যাবে প্রশিক্ষণ", desc: "শিক্ষার্থীরা কম্পিউটার ল্যাবে ব্যবহারিক প্রশিক্ষণ নিচ্ছে", color: "#1B8A50" },
    { id: 2, category: "ইভেন্ট", iconKey: "graduation", title: "সনদ প্রদান অনুষ্ঠান", desc: "সফল শিক্ষার্থীদের সনদপত্র প্রদান করা হচ্ছে", color: "#1565C0" },
    { id: 3, category: "ক্লাসরুম", iconKey: "scissors", title: "টেইলারিং ক্লাস", desc: "নারী শিক্ষার্থীরা টেইলারিং শিখছে", color: "#AD1457" },
    { id: 4, category: "ইভেন্ট", iconKey: "mic", title: "ওরিয়েন্টেশন প্রোগ্রাম", desc: "নতুন ব্যাচের ওরিয়েন্টেশন অনুষ্ঠান", color: "#E65100" },
    { id: 5, category: "ক্লাসরুম", iconKey: "chef", title: "শেফ ট্রেনিং ক্লাস", desc: "শিক্ষার্থীরা রান্নার ব্যবহারিক প্রশিক্ষণ নিচ্ছে", color: "#FF9800" },
    { id: 6, category: "প্রতিষ্ঠান", iconKey: "building", title: "প্রশিক্ষণ কেন্দ্র", desc: "আমাদের আধুনিক প্রশিক্ষণ কেন্দ্র", color: "#2E7D32" },
    { id: 7, category: "ইভেন্ট", iconKey: "handshake", title: "সমাবেশ ও আলোচনা", desc: "শিক্ষার্থী ও শিক্ষকদের যৌথ আলোচনা সভা", color: "#6A1B9A" },
    { id: 8, category: "প্রতিষ্ঠান", iconKey: "car", title: "ড্রাইভিং ট্রেনিং", desc: "ড্রাইভিং প্রশিক্ষণের ব্যবহারিক সেশন", color: "#795548" },
    { id: 9, category: "ইভেন্ট", iconKey: "party", title: "বার্ষিক সমাবেশ", desc: "প্রশিক্ষণার্থীদের বার্ষিক একত্রিত অনুষ্ঠান", color: "#F44336" },
];

const filterCategories = ["সকল", "ক্লাসরুম", "ইভেন্ট", "প্রতিষ্ঠান"];

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState("সকল");

    const filtered = activeFilter === "সকল"
        ? galleryItems
        : galleryItems.filter((item) => item.category === activeFilter);

    return (
        <>
            <section className={styles.pageHeader}>
                <div className={styles.pageHeaderBg} />
                <div className={`container ${styles.pageHeaderContent}`}>
                    <span className="section-badge section-badge-dark">
                        <CameraIcon size={14} color="var(--color-secondary-400)" />
                        গ্যালারি
                    </span>
                    <h1 className="heading-lg" style={{ color: "white" }}>
                        আমাদের <span className="gradient-text">মুহূর্তসমূহ</span>
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "600px", fontSize: "var(--text-lg)" }}>
                        প্রশিক্ষণ, ইভেন্ট ও কার্যক্রমের কিছু বিশেষ মুহূর্ত
                    </p>
                </div>
            </section>

            <section className={`section ${styles.gallerySection}`}>
                <div className="container">
                    {/* Category Filter Tabs */}
                    <div className={styles.filterTabs}>
                        {filterCategories.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.filterTab} ${activeFilter === cat ? styles.filterTabActive : ""}`}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className={styles.galleryGrid}>
                        {filtered.map((item, index) => (
                            <div
                                key={item.id}
                                className={`${styles.galleryCard} ${index === 0 || index === 5 ? styles.galleryCardLarge : ""}`}
                            >
                                <div className={styles.galleryImagePlaceholder} style={{ background: `linear-gradient(135deg, ${item.color}18, ${item.color}08)` }}>
                                    <div className={styles.galleryIconWrap} style={{ color: item.color }}>
                                        {galleryIcons[item.iconKey]}
                                    </div>
                                    <div className={styles.galleryPlaceholderLabel}>
                                        <ImageIcon size={14} color={item.color} />
                                        <span style={{ color: item.color }}>ছবি শীঘ্রই আসছে</span>
                                    </div>
                                </div>
                                <div className={styles.galleryCardBody}>
                                    <span className={styles.galleryCategory} style={{ color: item.color, background: `${item.color}10` }}>
                                        {item.category}
                                    </span>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "var(--space-12)" }}>
                        <p style={{ color: "var(--color-neutral-500)", marginBottom: "var(--space-4)" }}>
                            আরো ছবি ও ভিডিও দেখতে আমাদের ফেসবুক ও ইউটিউব চ্যানেল ভিজিট করুন
                        </p>
                        <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="https://facebook.com/assunnahfoundation" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                ফেসবুক পেজ
                            </a>
                            <a href="https://youtube.com/@assunnahfoundation" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                ইউটিউব চ্যানেল
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
