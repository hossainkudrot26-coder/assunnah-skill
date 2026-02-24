"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import {
  GraduationIcon, BookIcon,
  BriefcaseIcon, ChefHatIcon, ScissorsIcon, ChartIcon,
  CodeIcon, CarIcon, TargetIcon, ShieldCheckIcon,
  MosqueIcon, TrophyIcon, QuoteIcon, ArrowRightIcon,
  ClockIcon, HeartIcon, SparkleIcon, UsersIcon,
  CheckCircleIcon, PhoneIcon,
} from "@/shared/components/Icons";
import styles from "./page.module.css";

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1] as const;

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const heroChild = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease },
  },
};

const sectionStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

/* ═══════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ═══════════════════════════════════════════ */

function useCounter(target: number, duration = 2200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

/* ═══════════════════════════════════════════
   DATA — REAL COURSES
   ═══════════════════════════════════════════ */

const courses = [
  { id: 1, slug: "small-business-management", title: "স্মল বিজনেস ম্যানেজমেন্ট", desc: "MS Office, প্র্যাকটিক্যাল অ্যাকাউন্টিং, গ্রাফিক ডিজাইন, ক্রিয়েটিভ মার্কেটিং, ভিডিও এডিটিং, জেনারেটিভ AI, প্র্যাকটিক্যাল ইংলিশ ও মৌলিক দীনি জ্ঞান", duration: "৩ মাস", type: "রেসিডেন্সিয়াল", icon: <BriefcaseIcon size={26} color="#1B8A50" />, color: "#1B8A50", featured: true },
  { id: 2, slug: "chef-training", title: "শেফ ট্রেনিং অ্যান্ড কিচেন ম্যানেজমেন্ট", desc: "দৈনিক ১২-১৪ ঘণ্টা প্র্যাকটিক্যাল ট্রেনিং, ২৪ ঘণ্টা মেন্টর সাপোর্ট, রেসিডেন্সিয়াল — সম্পূর্ণ বিনামূল্যে", duration: "৪ মাস", type: "ফ্রি", icon: <ChefHatIcon size={26} color="#E65100" />, color: "#E65100", featured: false },
  { id: 3, slug: "sales-and-marketing", title: "দি আর্ট অব সেলস অ্যান্ড মার্কেটিং", desc: "সেলস স্ট্র্যাটেজি, কমিউনিকেশন, ব্র্যান্ডিং ও মার্কেটিং — ১০০% পর্যন্ত স্কলারশিপ সুবিধা", duration: "৩ মাস", type: "রেসিডেন্সিয়াল", icon: <ChartIcon size={26} color="#1565C0" />, color: "#1565C0", featured: false },
  { id: 4, slug: "smart-tailoring", title: "স্মার্ট টেইলারিং এন্ড ফ্যাশন ডিজাইন", desc: "টেইলারিং, টাই-ডাই, ব্লক-বাটিক, এমব্রয়ডারি — প্রশিক্ষণ শেষে ৫০,০০০+ টাকার সেলাই মেশিন ও সরঞ্জাম প্রদান", duration: "৩ মাস", type: "নারীদের জন্য", icon: <ScissorsIcon size={26} color="#AD1457" />, color: "#AD1457", featured: false },
  { id: 5, slug: "shoe-entrepreneurship", title: "জুতা শিল্পে উদ্যোক্তা", desc: "জুতা ডিজাইন, উৎপাদন ও বিপণন — প্রশিক্ষণ শেষে আস-সুন্নাহ ফাউন্ডেশন থেকে আর্থিক সহায়তা", duration: "৩ মাস", type: "ফ্রি", icon: <TargetIcon size={26} color="#795548" />, color: "#795548", featured: false },
  { id: 6, slug: "driving-training", title: "ড্রাইভিং ট্রেনিং", desc: "দক্ষ ও সৎ ড্রাইভার তৈরির পেশাদার প্রশিক্ষণ", duration: "১ মাস", type: "ফ্রি", icon: <CarIcon size={26} color="#2E7D32" />, color: "#2E7D32", featured: false },
];

const testimonials = [
  { name: "আব্দুল্লাহ আল মামুন", batch: "স্মল বিজনেস ম্যানেজমেন্ট - ব্যাচ ৩", text: "এই কোর্সের মাধ্যমে আমি নিজের ব্যবসা শুরু করতে পেরেছি। গ্রাফিক ডিজাইন ও ডিজিটাল মার্কেটিং শিখে এখন অনলাইনে আয় করছি।", initials: "আম" },
  { name: "ফাতেমা খাতুন", batch: "স্মার্ট টেইলারিং - ব্যাচ ২", text: "আমি এখন নিজের বাড়িতে বসে টেইলারিং ব্যবসা চালাচ্ছি। আস-সুন্নাহ স্কিলে শিখেছি কিভাবে ব্যবসা পরিচালনা করতে হয়।", initials: "ফখ" },
  { name: "মোহাম্মদ হাসান", batch: "শেফ ট্রেনিং - ব্যাচ ১", text: "শেফ ট্রেনিং কোর্স আমার জীবন বদলে দিয়েছে। এখন একটি রেস্টুরেন্টে কাজ করছি এবং ভালো আয় করছি।", initials: "মহ" },
];

const marqueeStats = [
  { value: "২,৫০০+", label: "প্রশিক্ষিত শিক্ষার্থী" },
  { value: "২০+", label: "চালু কোর্স" },
  { value: "৭টি", label: "কম্পিউটার ল্যাব" },
  { value: "১০,৯৬২+", label: "অনলাইন শিক্ষার্থী" },
  { value: "২৪,০০০", label: "স্কয়ার ফিট ক্যাম্পাস" },
  { value: "১০০%", label: "স্কলারশিপ সুবিধা" },
];

const features = [
  { icon: <ShieldCheckIcon size={24} color="var(--color-primary-500)" />, title: "NSDA নিবন্ধিত", desc: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ কর্তৃক স্বীকৃত" },
  { icon: <GraduationIcon size={24} color="var(--color-primary-500)" />, title: "স্কলারশিপ সুবিধা", desc: "মেধাবী ও সুবিধাবঞ্চিতদের জন্য ১০০% পর্যন্ত স্কলারশিপ" },
  { icon: <MosqueIcon size={24} color="var(--color-primary-500)" />, title: "পৃথক পরিবেশ", desc: "নারী ও পুরুষের জন্য সম্পূর্ণ পৃথক প্রশিক্ষণ ব্যবস্থা" },
  { icon: <TrophyIcon size={24} color="var(--color-accent-500)" />, title: "জব প্লেসমেন্ট", desc: "প্রশিক্ষণ শেষে কর্মসংস্থানের সুযোগ ও সহায়তা" },
];

/* ═══════════════════════════════════════════
   MARQUEE COMPONENT
   ═══════════════════════════════════════════ */

function Marquee({ children, reverse = false }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className={styles.marqueeTrack}>
      <div className={`${styles.marqueeInner} ${reverse ? styles.marqueeReverse : ""}`}>
        {children}
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════ */

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  // Testimonial carousel
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // GSAP scroll-triggered parallax for mission section
  const missionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    const initGSAP = async () => {
      try {
        const gsapModule = await import("gsap");
        const scrollTriggerModule = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default;
        gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

        ctx = gsap.context(() => {
          // Parallax for mission cards
          gsap.utils.toArray<HTMLElement>(`.${styles.featureCard}`).forEach((card, i) => {
            gsap.fromTo(
              card,
              { y: 60 + i * 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          // Parallax float for decorative elements
          gsap.utils.toArray<HTMLElement>(`.${styles.parallaxFloat}`).forEach((el) => {
            gsap.to(el, {
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          });
        }, missionRef);
      } catch {
        // GSAP not available (SSR or error), gracefully degrade
      }
    };
    initGSAP();
    return () => ctx?.revert();
  }, []);

  return (
    <>
      {/* ════════════════════════════════════
          HERO — Aurora + Deep Forest Green
          ════════════════════════════════════ */}
      <section className={styles.hero} ref={heroRef}>
        {/* Aurora Background */}
        <motion.div className={styles.heroAurora} style={{ y: heroY }}>
          <div className={styles.auroraBlob1} />
          <div className={styles.auroraBlob2} />
          <div className={styles.auroraBlob3} />
          <div className={styles.auroraBlob4} />
        </motion.div>

        {/* Grid Pattern */}
        <div className={styles.heroGrid} />

        {/* Noise Texture */}
        <div className={styles.heroNoise} />

        {/* Content */}
        <motion.div
          className={styles.heroContent}
          style={{ opacity: heroOpacity }}
          initial="hidden"
          animate="visible"
          variants={heroStagger}
        >
          <div className={styles.heroText}>
            <motion.div className={styles.heroBadge} variants={heroChild}>
              <span className={styles.heroBadgePulse} />
              <ShieldCheckIcon size={14} color="var(--color-secondary-300)" />
              NSDA নিবন্ধিত প্রতিষ্ঠান
            </motion.div>

            <motion.h1 className={styles.heroTitle} variants={heroChild}>
              <span className={styles.heroTitleSm}>দক্ষতায়</span>
              <span className={styles.heroTitleLg}>
                সমৃদ্ধি
                <svg className={styles.heroTitleUnderline} viewBox="0 0 280 12" preserveAspectRatio="none">
                  <path d="M2 8C50 2 100 2 140 6C180 10 230 10 278 4" stroke="url(#ugrd)" strokeWidth="3" fill="none" strokeLinecap="round">
                    <animate attributeName="d" dur="4s" repeatCount="indefinite"
                      values="M2 8C50 2 100 2 140 6C180 10 230 10 278 4;M2 4C50 10 100 10 140 6C180 2 230 2 278 8;M2 8C50 2 100 2 140 6C180 10 230 10 278 4" />
                  </path>
                  <defs>
                    <linearGradient id="ugrd">
                      <stop offset="0%" stopColor="#8DC63F" />
                      <stop offset="100%" stopColor="#D4A843" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className={styles.heroTitleMd}>প্রশিক্ষণে ভবিষ্যৎ</span>
            </motion.h1>

            <motion.p className={styles.heroDesc} variants={heroChild}>
              আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট — বাংলাদেশের বেকার যুবক-যুবতীদের
              দক্ষ জনশক্তিতে রূপান্তর করে কর্মসংস্থান সৃষ্টির অঙ্গীকার।
            </motion.p>

            <motion.div className={styles.heroActions} variants={heroChild}>
              <Link href="/courses" className={styles.heroBtnPrimary}>
                <span className={styles.heroBtnShine} />
                <BookIcon size={18} color="white" />
                কোর্সসমূহ দেখুন
                <ArrowRightIcon size={15} color="white" />
              </Link>
              <Link href="/about" className={styles.heroBtnOutline}>
                আমাদের সম্পর্কে
                <ArrowRightIcon size={15} />
              </Link>
            </motion.div>

            {/* Mini Stats */}
            <motion.div className={styles.heroMiniStats} variants={heroChild}>
              {[
                { v: "২,৫০০+", l: "শিক্ষার্থী", ic: <GraduationIcon size={16} color="var(--color-secondary-300)" /> },
                { v: "২০+", l: "কোর্স", ic: <BookIcon size={16} color="var(--color-secondary-300)" /> },
                { v: "১০০%", l: "স্কলারশিপ", ic: <HeartIcon size={16} color="var(--color-secondary-300)" /> },
              ].map((s, i) => (
                <div key={i} className={styles.heroMiniStat}>
                  {s.ic}
                  <span className={styles.heroMiniStatVal}>{s.v}</span>
                  <span className={styles.heroMiniStatLabel}>{s.l}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating Card Stack */}
          <motion.div className={styles.heroVisual} variants={heroChild}>
            <div className={styles.heroCardStack}>
              {/* Background cards for depth */}
              <div className={`${styles.heroStackCard} ${styles.heroStackCard3}`} />
              <div className={`${styles.heroStackCard} ${styles.heroStackCard2}`} />
              {/* Main card */}
              <div className={`${styles.heroStackCard} ${styles.heroStackCard1}`}>
                <div className={styles.heroCardInner}>
                  <div className={styles.heroCardHeader}>
                    <div className={styles.heroCardIcon}>
                      <BriefcaseIcon size={22} color="#1B8A50" />
                    </div>
                    <span className={styles.heroCardBadge}>জনপ্রিয়</span>
                  </div>
                  <h3 className={styles.heroCardTitle}>স্মল বিজনেস ম্যানেজমেন্ট</h3>
                  <p className={styles.heroCardDesc}>MS Office, গ্রাফিক ডিজাইন, ক্রিয়েটিভ মার্কেটিং, জেনারেটিভ AI</p>
                  <div className={styles.heroCardMeta}>
                    <span><ClockIcon size={13} color="var(--color-neutral-400)" /> ৩ মাস</span>
                    <span className={styles.heroCardMetaFree}>রেসিডেন্সিয়াল</span>
                  </div>
                  <div className={styles.heroCardProgress}>
                    <div className={styles.heroCardProgressBar} />
                    <span>ভর্তি চলছে</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent elements */}
            <div className={`${styles.heroFloatEl} ${styles.heroFloat1}`}>
              <SparkleIcon size={20} color="var(--color-accent-400)" />
            </div>
            <div className={`${styles.heroFloatEl} ${styles.heroFloat2}`}>
              <CheckCircleIcon size={18} color="var(--color-secondary-400)" />
            </div>
          </motion.div>
        </motion.div>

        {/* Wave Divider */}
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,60 C240,100 480,20 720,50 C960,80 1200,30 1440,60 L1440,100 L0,100 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS MARQUEE — Infinite Ticker
          ════════════════════════════════════ */}
      <section className={styles.marqueeSection}>
        <Marquee>
          {marqueeStats.map((stat, i) => (
            <div key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeValue}>{stat.value}</span>
              <span className={styles.marqueeLabel}>{stat.label}</span>
              <span className={styles.marqueeDot}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3Z"/></svg>
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ════════════════════════════════════
          COURSES — Bento Grid
          ════════════════════════════════════ */}
      <section className={`section section-dark ${styles.coursesSection}`}>
        <div className={styles.coursesGlow} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionStagger}
          >
            <motion.div className={`${styles.sectionBadge} ${styles.sectionBadgeDark}`} variants={fadeUp}>
              <BookIcon size={15} color="var(--color-secondary-400)" />
              <span>কোর্সসমূহ</span>
            </motion.div>
            <motion.h2 className="heading-md" variants={fadeUp}>
              আপনার ভবিষ্যৎ গড়ুন{" "}
              <span className="gradient-text">সঠিক দক্ষতায়</span>
            </motion.h2>
            <motion.p className="section-subtitle" style={{ color: "rgba(255, 255, 255, 0.55)" }} variants={fadeUp}>
              ব্যবসা থেকে প্রযুক্তি, কারিগরি থেকে সৃজনশীল — আপনার পছন্দের কোর্স বেছে নিন
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.bentoGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={sectionStagger}
          >
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                variants={fadeScale}
                className={`${styles.bentoCard} ${course.featured ? styles.bentoCardFeatured : ""}`}
              >
                <Link href={`/courses/${course.slug}`} className={styles.bentoCardLink}>
                  <div className={styles.bentoCardGlow} style={{
                    background: `radial-gradient(ellipse at top left, ${course.color}20, transparent 70%)`
                  }} />

                  <div className={styles.bentoCardTop}>
                    <div className={styles.bentoIconWrap} style={{
                      background: `${course.color}12`,
                      borderColor: `${course.color}25`,
                    }}>
                      {course.icon}
                    </div>
                    <span className={styles.bentoTypeBadge} style={{
                      background: `${course.color}15`,
                      color: course.color,
                      borderColor: `${course.color}30`,
                    }}>
                      {course.type}
                    </span>
                  </div>

                  <h3 className={styles.bentoTitle}>{course.title}</h3>
                  <p className={styles.bentoDesc}>{course.desc}</p>

                  <div className={styles.bentoBottom}>
                    <span className={styles.bentoDuration}>
                      <ClockIcon size={13} color="rgba(255,255,255,0.5)" />
                      {course.duration}
                    </span>
                    <span className={styles.bentoArrow}>
                      বিস্তারিত
                      <ArrowRightIcon size={13} />
                    </span>
                  </div>

                  {/* Hover border glow */}
                  <div className={styles.bentoBorderGlow} style={{
                    background: `linear-gradient(135deg, ${course.color}50, transparent, ${course.color}30)`,
                  }} />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.coursesAction}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/courses" className={styles.viewAllBtn}>
              <SparkleIcon size={17} color="var(--color-dark-bg)" />
              সকল কোর্স দেখুন
              <ArrowRightIcon size={15} color="var(--color-dark-bg)" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          MISSION — Overlapping Cards + Depth
          ════════════════════════════════════ */}
      <section className={styles.missionSection} ref={missionRef}>
        <div className={styles.missionBgPattern} />
        <div className="container">
          <motion.div
            className={styles.missionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionStagger}
          >
            <motion.div className={styles.sectionBadge} variants={fadeUp}>
              <TargetIcon size={15} color="var(--color-primary-600)" />
              <span>আমাদের লক্ষ্য</span>
            </motion.div>
            <motion.h2 className="heading-md" variants={fadeUp}>
              বেকারত্ব দূর করে{" "}
              <span className="gradient-text">দক্ষ জনশক্তি</span>{" "}
              তৈরি
            </motion.h2>
            <motion.p className={styles.missionSubtext} variants={fadeUp}>
              আস-সুন্নাহ ফাউন্ডেশনের প্রতিষ্ঠাতা শায়খ আহমাদুল্লাহর নির্দেশনায় এই ইনস্টিটিউট
              ২০২২ সালে প্রতিষ্ঠিত হয়। আমাদের লক্ষ্য হলো বাংলাদেশের যুবক-যুবতীদের কম্পিউটার ও
              কারিগরি প্রশিক্ষণের মাধ্যমে দক্ষ জনশক্তি হিসেবে গড়ে তোলা।
            </motion.p>
          </motion.div>

          <div className={styles.missionGrid}>
            {/* Feature Cards */}
            <motion.div
              className={styles.missionFeatures}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={sectionStagger}
            >
              {features.map((f, i) => (
                <motion.div key={i} className={styles.featureCard} variants={fadeUp}>
                  <div className={styles.featureIconBox}>
                    {f.icon}
                  </div>
                  <div className={styles.featureContent}>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                  <div className={styles.featureCardLine} />
                </motion.div>
              ))}
            </motion.div>

            {/* Visual Side — Image + Floating Cards */}
            <motion.div
              className={styles.missionVisual}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInRight}
            >
              <div className={styles.missionImageFrame}>
                <Image
                  src="/images/hero-banner.png"
                  alt="প্রশিক্ষণ কেন্দ্র"
                  width={560}
                  height={420}
                  className={styles.missionImage}
                />
                <div className={styles.missionImageGradient} />

                {/* Floating Stats */}
                <div className={`${styles.missionFloat} ${styles.missionFloat1} ${styles.parallaxFloat}`}>
                  <TrophyIcon size={22} color="var(--color-accent-500)" />
                  <div>
                    <strong>১ লক্ষ</strong>
                    <span>বার্ষিক লক্ষ্যমাত্রা</span>
                  </div>
                </div>

                <div className={`${styles.missionFloat} ${styles.missionFloat2} ${styles.parallaxFloat}`}>
                  <UsersIcon size={20} color="var(--color-primary-500)" />
                  <div>
                    <strong>২,৫০০+</strong>
                    <span>সফল গ্র্যাজুয়েট</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALS — Featured Carousel
          ════════════════════════════════════ */}
      <section className={`section section-dark ${styles.testimonialSection}`}>
        <div className={styles.testimonialGlow} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionStagger}
          >
            <motion.div className={`${styles.sectionBadge} ${styles.sectionBadgeDark}`} variants={fadeUp}>
              <QuoteIcon size={15} color="var(--color-secondary-400)" />
              <span>সাফল্যের গল্প</span>
            </motion.div>
            <motion.h2 className="heading-md" variants={fadeUp}>
              আমাদের{" "}
              <span className="gradient-text">শিক্ষার্থীরা</span>{" "}
              বলছেন
            </motion.h2>
          </motion.div>

          <motion.div
            className={styles.testimonialLayout}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Large Featured Quote */}
            <div className={styles.testimonialFeatured}>
              <div className={styles.testimonialBigQuote}>
                <QuoteIcon size={64} color="rgba(123, 199, 77, 0.15)" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease }}
                  className={styles.testimonialFeaturedInner}
                >
                  <p className={styles.testimonialFeaturedText}>
                    {testimonials[activeTestimonial].text}
                  </p>
                  <div className={styles.testimonialFeaturedAuthor}>
                    <div className={styles.testimonialAvatar}>
                      <span>{testimonials[activeTestimonial].initials}</span>
                    </div>
                    <div>
                      <strong>{testimonials[activeTestimonial].name}</strong>
                      <span className={styles.testimonialBatch}>
                        {testimonials[activeTestimonial].batch}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className={styles.testimonialDots}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.testimonialDot} ${i === activeTestimonial ? styles.testimonialDotActive : ""}`}
                    onClick={() => setActiveTestimonial(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Side Cards */}
            <div className={styles.testimonialSide}>
              {testimonials
                .filter((_, i) => i !== activeTestimonial)
                .slice(0, 2)
                .map((t, i) => (
                  <div key={t.name} className={styles.testimonialSideCard}>
                    <QuoteIcon size={20} color="rgba(123, 199, 77, 0.25)" />
                    <p className={styles.testimonialSideText}>{t.text}</p>
                    <div className={styles.testimonialSideAuthor}>
                      <div className={styles.testimonialAvatarSm}>
                        <span>{t.initials}</span>
                      </div>
                      <div>
                        <strong>{t.name}</strong>
                        <span>{t.batch}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA — Deep Forest Green Gradient
          ════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaMesh}>
          <div className={styles.ctaMeshBlob1} />
          <div className={styles.ctaMeshBlob2} />
          <div className={styles.ctaMeshBlob3} />
        </div>
        <div className={styles.ctaGrid} />

        <motion.div
          className={`container ${styles.ctaContent}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionStagger}
        >
          <motion.div variants={fadeUp}>
            <SparkleIcon size={36} color="var(--color-accent-400)" />
          </motion.div>
          <motion.h2 className={styles.ctaTitle} variants={fadeUp}>
            আজই আপনার
            <br />
            <span className="gradient-text">দক্ষতার যাত্রা</span> শুরু করুন
          </motion.h2>
          <motion.p className={styles.ctaSubtext} variants={fadeUp}>
            সম্পূর্ণ ফ্রি অথবা স্কলারশিপে ভর্তি হন আমাদের যেকোনো কোর্সে
          </motion.p>
          <motion.div className={styles.ctaActions} variants={fadeUp}>
            <Link href="/courses" className={styles.ctaBtnPrimary}>
              <span className={styles.heroBtnShine} />
              এখনই ভর্তি হন
              <ArrowRightIcon size={16} color="white" />
            </Link>
            <Link href="/contact" className={styles.ctaBtnOutline}>
              <PhoneIcon size={16} />
              যোগাযোগ করুন
            </Link>
          </motion.div>
          <motion.div className={styles.ctaContact} variants={fadeUp}>
            <PhoneIcon size={14} color="rgba(255,255,255,0.5)" />
            <span>কল করুন: {siteConfig.contact.phone} | {siteConfig.contact.phone2}</span>
          </motion.div>
        </motion.div>

        {/* Floating decorative elements */}
        <div className={styles.ctaFloat1}>
          <SparkleIcon size={24} color="rgba(123, 199, 77, 0.2)" />
        </div>
        <div className={styles.ctaFloat2}>
          <SparkleIcon size={16} color="rgba(212, 168, 67, 0.2)" />
        </div>
      </section>
    </>
  );
}
