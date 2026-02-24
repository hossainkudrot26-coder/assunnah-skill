"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { images } from "@/config/images";
import {
  CameraIcon, XIcon, ChevronLeftIcon, ChevronRightIcon,
  ExpandIcon, MonitorIcon, GraduationIcon, ChefHatIcon,
  BuildingIcon, CarIcon,
} from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import styles from "./gallery.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  desc: string;
  category: string;
  span?: "wide" | "tall";
}

const galleryItems: GalleryItem[] = [
  { id: 1, src: images.gallery.computerLab, title: "কম্পিউটার ল্যাবে প্রশিক্ষণ", desc: "শিক্ষার্থীরা আধুনিক কম্পিউটার ল্যাবে ব্যবহারিক প্রশিক্ষণ নিচ্ছে", category: "ক্লাসরুম", span: "wide" },
  { id: 2, src: images.gallery.certificate, title: "সনদ প্রদান অনুষ্ঠান", desc: "সফল শিক্ষার্থীদের হাতে সনদপত্র তুলে দেওয়া হচ্ছে", category: "ইভেন্ট" },
  { id: 3, src: images.gallery.tailoring, title: "টেইলারিং প্রশিক্ষণ", desc: "নারী শিক্ষার্থীরা সেলাই ও ফ্যাশন ডিজাইন শিখছে", category: "ক্লাসরুম" },
  { id: 4, src: images.gallery.orientation, title: "ওরিয়েন্টেশন প্রোগ্রাম", desc: "নতুন ব্যাচের শিক্ষার্থীদের ওরিয়েন্টেশন অনুষ্ঠান", category: "ইভেন্ট", span: "tall" },
  { id: 5, src: images.gallery.chefTraining, title: "শেফ ট্রেনিং", desc: "দৈনিক ১২-১৪ ঘণ্টা ব্যবহারিক রান্না প্রশিক্ষণ", category: "ক্লাসরুম" },
  { id: 6, src: images.gallery.campus, title: "প্রশিক্ষণ কেন্দ্র", desc: "২৪,০০০ বর্গফুটের আধুনিক প্রশিক্ষণ কেন্দ্র", category: "প্রতিষ্ঠান", span: "wide" },
  { id: 7, src: images.gallery.discussion, title: "গ্রুপ ডিসকাশন", desc: "শিক্ষার্থীদের সমস্যা সমাধান ও দলীয় আলোচনা", category: "ক্লাসরুম" },
  { id: 8, src: images.gallery.driving, title: "ড্রাইভিং প্রশিক্ষণ", desc: "ড্রাইভিং প্রশিক্ষণের ব্যবহারিক সেশন", category: "প্রতিষ্ঠান" },
  { id: 9, src: images.gallery.annual, title: "বার্ষিক সমাবেশ", desc: "প্রশিক্ষণার্থীদের বার্ষিক মিলনমেলা", category: "ইভেন্ট" },
];

const filterCategories = ["সকল", "ক্লাসরুম", "ইভেন্ট", "প্রতিষ্ঠান"];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("সকল");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeFilter === "সকল"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  const openLightbox = useCallback((id: number) => setLightbox(id), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigateLightbox = useCallback((dir: 1 | -1) => {
    setLightbox((prev) => {
      if (prev === null) return null;
      const idx = filtered.findIndex((i) => i.id === prev);
      const next = (idx + dir + filtered.length) % filtered.length;
      return filtered[next].id;
    });
  }, [filtered]);

  const currentItem = lightbox !== null ? galleryItems.find((i) => i.id === lightbox) : null;

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    };
    document.addEventListener("keydown", handler);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox, navigateLightbox]);

  return (
    <>
      <PageHeader
        title="আমাদের মুহূর্তসমূহ"
        subtitle="প্রশিক্ষণ, ইভেন্ট ও কার্যক্রমের কিছু বিশেষ মুহূর্ত"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "গ্যালারি" },
        ]}
        badge={{ icon: <CameraIcon size={14} color="var(--color-secondary-300)" />, text: "গ্যালারি" }}
      />

      <section className={styles.gallerySection}>
        <div className="container">
          {/* Filters */}
          <motion.div
            className={styles.filterBar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {filterCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Masonry Grid */}
          <motion.div
            className={styles.masonryGrid}
            initial="hidden"
            animate="visible"
            variants={stagger}
            key={activeFilter}
          >
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                className={`${styles.gridItem} ${item.span === "wide" ? styles.gridItemWide : ""} ${item.span === "tall" ? styles.gridItemTall : ""}`}
                variants={fadeUp}
                layout
              >
                <button
                  className={styles.imageCard}
                  onClick={() => openLightbox(item.id)}
                  aria-label={`${item.title} দেখুন`}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardOverlay}>
                    <div className={styles.cardExpandIcon}>
                      <ExpandIcon size={20} color="white" />
                    </div>
                    <div className={styles.cardInfo}>
                      <span className={styles.cardCategory}>{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Social CTA */}
          <motion.div
            className={styles.socialCta}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <p>আরো ছবি ও ভিডিও দেখতে আমাদের সোশ্যাল মিডিয়া ভিজিট করুন</p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com/assunnahfoundation" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                ফেসবুক পেজ
              </a>
              <a href="https://youtube.com/@assunnahfoundation" target="_blank" rel="noopener noreferrer" className={styles.socialBtnOutline}>
                ইউটিউব চ্যানেল
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="বন্ধ করুন">
              <XIcon size={24} color="white" />
            </button>
            <button className={styles.lightboxNav} data-dir="prev" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} aria-label="আগের ছবি">
              <ChevronLeftIcon size={28} color="white" />
            </button>

            <motion.div
              className={styles.lightboxContent}
              key={currentItem.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.lightboxImageWrap}>
                <Image
                  src={currentItem.src}
                  alt={currentItem.title}
                  fill
                  sizes="90vw"
                  className={styles.lightboxImage}
                  priority
                />
              </div>
              <div className={styles.lightboxCaption}>
                <h3>{currentItem.title}</h3>
                <p>{currentItem.desc}</p>
              </div>
            </motion.div>

            <button className={styles.lightboxNav} data-dir="next" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} aria-label="পরের ছবি">
              <ChevronRightIcon size={28} color="white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
