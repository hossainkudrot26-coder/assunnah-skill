"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import {
  GraduationIcon, BookIcon,
  BriefcaseIcon, ShieldCheckIcon,
  MosqueIcon, TrophyIcon, QuoteIcon, ArrowRightIcon,
  ClockIcon, HeartIcon, SparkleIcon, UsersIcon,
  CheckCircleIcon, PhoneIcon, TargetIcon,
  HandshakeIcon, BuildingIcon, AwardIcon, StarIcon,
  CalendarIcon, ZapIcon,
} from "@/shared/components/Icons";
import styles from "./page.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface DisplayCourse {
  id: string;
  slug: string;
  title: string;
  desc: string;
  duration: string;
  type: string;
  icon: React.ReactNode;
  color: string;
  featured: boolean;
}

interface DisplayTestimonial {
  name: string;
  batch: string;
  text: string;
  initials: string;
}

interface HomePageClientProps {
  courses: DisplayCourse[];
  testimonials: DisplayTestimonial[];
}

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

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

/* ═══════════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════════ */

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

const whyChooseUs = [
  { icon: <ShieldCheckIcon size={28} color="var(--color-primary-500)" />, title: "সরকারি স্বীকৃতি", desc: "NSDA নিবন্ধিত — আপনার সার্টিফিকেট সরকারিভাবে গ্রহণযোগ্য", highlight: "NSDA" },
  { icon: <HeartIcon size={28} color="#E65100" />, title: "সম্পূর্ণ বিনামূল্যে", desc: "অনেক কোর্সে ১০০% ফ্রি প্রশিক্ষণ — থাকা-খাওয়া সহ", highlight: "ফ্রি" },
  { icon: <BuildingIcon size={28} color="#1565C0" />, title: "আবাসিক ক্যাম্পাস", desc: "২৪,০০০ স্কয়ার ফিটের আধুনিক ক্যাম্পাসে রেসিডেন্সিয়াল প্রশিক্ষণ", highlight: "২৪,০০০ sqft" },
  { icon: <HandshakeIcon size={28} color="#7B1FA2" />, title: "চাকরি সহায়তা", desc: "প্রশিক্ষণ শেষে কর্মসংস্থান ও উদ্যোক্তাদের জন্য আর্থিক সহায়তা", highlight: "চাকরি" },
  { icon: <MosqueIcon size={28} color="#2E7D32" />, title: "ইসলামি পরিবেশ", desc: "ইসলামি মূল্যবোধের আলোকে — নারী-পুরুষ সম্পূর্ণ পৃথক ব্যবস্থা", highlight: "পৃথক" },
  { icon: <AwardIcon size={28} color="#D4A843" />, title: "অভিজ্ঞ প্রশিক্ষক", desc: "ইন্ডাস্ট্রি এক্সপার্টদের তত্ত্বাবধানে হাতে-কলমে শিক্ষা ও ২৪/৭ মেন্টর সাপোর্ট", highlight: "২৪/৭" },
];

const impactCounters = [
  { end: 2500, suffix: "+", label: "প্রশিক্ষিত শিক্ষার্থী", icon: <GraduationIcon size={32} color="var(--color-secondary-400)" /> },
  { end: 15, suffix: "টি", label: "সম্পন্ন ব্যাচ", icon: <AwardIcon size={32} color="var(--color-accent-400)" /> },
  { end: 95, suffix: "%", label: "কর্মসংস্থান হার", icon: <TrophyIcon size={32} color="#E65100" /> },
  { end: 24000, suffix: "", label: "স্কয়ার ফিট ক্যাম্পাস", icon: <BuildingIcon size={32} color="#1565C0" /> },
];

const partnerLogos = [
  { name: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ", abbr: "NSDA", color: "#1B6B3A", desc: "সরকারি নিবন্ধন" },
  { name: "আস-সুন্নাহ ফাউন্ডেশন", abbr: "ASF", color: "#1B8A50", desc: "প্রতিষ্ঠাতা সংস্থা" },
  { name: "বাংলাদেশ কারিগরি শিক্ষা বোর্ড", abbr: "BTEB", color: "#1565C0", desc: "কারিগরি সনদ" },
  { name: "তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ", abbr: "ICT", color: "#7B1FA2", desc: "ডিজিটাল প্রশিক্ষণ" },
  { name: "যুব ও ক্রীড়া মন্ত্রণালয়", abbr: "MoYS", color: "#E65100", desc: "যুব উন্নয়ন" },
  { name: "সমাজসেবা অধিদপ্তর", abbr: "DSS", color: "#2E7D32", desc: "সামাজিক কল্যাণ" },
];

/* ═══════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ═══════════════════════════════════════════ */

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// Convert to Bengali numerals reliably
function toBanglaNum(n: number): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return n.toLocaleString("en-US").replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
}

function CounterCard({ end, suffix, label, icon }: { end: number; suffix: string; label: string; icon: React.ReactNode }) {
  const { count, ref } = useCountUp(end, end > 1000 ? 2500 : 2000);
  return (
    <div ref={ref} className={styles.counterCard}>
      <div className={styles.counterIcon}>{icon}</div>
      <div className={styles.counterValue}>
        {toBanglaNum(count)}<span className={styles.counterSuffix}>{suffix}</span>
      </div>
      <div className={styles.counterLabel}>{label}</div>
    </div>
  );
}

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
   HOMEPAGE CLIENT COMPONENT
   ═══════════════════════════════════════════ */

export default function HomePageClient({ courses, testimonials }: HomePageClientProps) {
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
  }, [testimonials.length]);

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
        // GSAP not available, gracefully degrade
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
        {/* Video Background (when available) */}
        <div className={styles.heroVideoWrap}>
          <video
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-banner.png"
          >
            {/* Sir: ক্যাম্পাসের video এখানে যোগ করুন */}
            {/* <source src="/videos/campus-loop.mp4" type="video/mp4" /> */}
          </video>
          <div className={styles.heroVideoOverlay} />
        </div>

        {/* Aurora Background (fallback when no video) */}
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
          WHY CHOOSE US — USP Cards
          ════════════════════════════════════ */}
      <section className={styles.whySection}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionStagger}
          >
            <motion.div className={styles.sectionBadge} variants={fadeUp}>
              <StarIcon size={15} color="var(--color-primary-600)" />
              <span>কেন আস-সুন্নাহ?</span>
            </motion.div>
            <motion.h2 className="heading-md" variants={fadeUp}>
              <span className="gradient-text">আমাদের বেছে নেওয়ার</span> ৬টি কারণ
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeUp}>
              শুধু প্রশিক্ষণ নয় — জীবন বদলানোর সম্পূর্ণ প্ল্যাটফর্ম
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.whyGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={sectionStagger}
          >
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} className={styles.whyCard} variants={fadeUp}>
                <span className={styles.whyNumber}>0{i + 1}</span>
                <div className={styles.whyCardIcon}>{item.icon}</div>
                <div className={styles.whyCardContent}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <span className={styles.whyHighlight}>{item.highlight}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          IMPACT COUNTER — Animated Numbers
          ════════════════════════════════════ */}
      <section className={styles.counterSection}>
        <div className={styles.counterBgPattern} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionStagger}
          >
            <motion.div className={`${styles.sectionBadge} ${styles.sectionBadgeDark}`} variants={fadeUp}>
              <ZapIcon size={15} color="var(--color-secondary-400)" />
              <span>আমাদের প্রভাব</span>
            </motion.div>
            <motion.h2 className="heading-md" variants={fadeUp}>
              সংখ্যায় <span className="gradient-text">আস-সুন্নাহ</span>
            </motion.h2>
          </motion.div>
          <div className={styles.counterGrid}>
            {impactCounters.map((c, i) => (
              <CounterCard key={i} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          PARTNERS / NSDA — Logo Strip
          ════════════════════════════════════ */}
      <section className={styles.partnersSection}>
        <div className="container">
          <motion.div
            className={styles.partnersHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.partnersDivider} />
            <span className={styles.partnersLabel}>সহযোগী প্রতিষ্ঠানসমূহ</span>
            <span className={styles.partnersDivider} />
          </motion.div>
          <motion.div
            className={styles.partnersGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionStagger}
          >
            {partnerLogos.map((p, i) => (
              <motion.div
                key={i}
                className={styles.partnerCard}
                variants={fadeUp}
              >
                <div className={styles.partnerLogo} style={{ borderColor: `${p.color}30` }}>
                  <span style={{ color: p.color, fontWeight: 800, fontSize: "1.1rem" }}>{p.abbr}</span>
                </div>
                <span className={styles.partnerName}>{p.name}</span>
                <span className={styles.partnerDesc}>{p.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          UPCOMING BATCH — Urgency Banner
          ════════════════════════════════════ */}
      <section className={styles.batchBanner}>
        <div className="container">
          <motion.div
            className={styles.batchInner}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <div className={styles.batchLeft}>
              <div className={styles.batchLive}>
                <span className={styles.batchLiveDot} />
                ভর্তি চলছে
              </div>
              <h3 className={styles.batchTitle}>ব্যাচ ১৭ — ভর্তি চলছে</h3>
              <p className={styles.batchDesc}>
                মাত্র ১৫টি আসন বাকি — এখনই আবেদন করুন এবং আপনার ভবিষ্যৎ গড়ে তুলুন
              </p>
            </div>
            <div className={styles.batchRight}>
              <div className={styles.batchStats}>
                <div className={styles.batchStat}>
                  <CalendarIcon size={18} color="var(--color-secondary-400)" />
                  <div>
                    <strong>কোর্স সময়কাল</strong>
                    <span>৩-৪ মাস</span>
                  </div>
                </div>
                <div className={styles.batchStat}>
                  <UsersIcon size={18} color="var(--color-secondary-400)" />
                  <div>
                    <strong>ব্যাচ সাইজ</strong>
                    <span>৩০-৪০ জন</span>
                  </div>
                </div>
              </div>
              <Link href="/admission/apply" className={styles.batchBtn}>
                <span className={styles.heroBtnShine} />
                এখনই আবেদন করুন
                <ArrowRightIcon size={16} color="white" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          QUIZ CTA — Course Finder
          ════════════════════════════════════ */}
      <section className={styles.quizCta}>
        <div className="container">
          <motion.div
            className={styles.quizCtaInner}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.quizCtaLeft}>
              <h3 className={styles.quizCtaTitle}>কোন কোর্সটি আপনার জন্য উপযুক্ত?</h3>
              <p className={styles.quizCtaDesc}>কয়েকটি সহজ প্রশ্নের উত্তর দিন — আমরা আপনার জন্য সেরা কোর্স খুঁজে দেবো</p>
            </div>
            <Link href="/quiz" className={styles.quizCtaBtn}>
              কোর্স ফাইন্ডার
              <ArrowRightIcon size={16} color="white" />
            </Link>
          </motion.div>
        </div>
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
            {courses.map((course) => (
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

          {/* Founder Quote */}
          <motion.div
            className={styles.founderQuote}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <QuoteIcon size={24} color="var(--color-primary-300)" />
            <blockquote>
              আমরা চাই প্রতিটি বেকার যুবক-যুবতী একটি সম্মানজনক পেশায় নিজেকে প্রতিষ্ঠিত করুক — এটাই আমাদের স্বপ্ন।
            </blockquote>
            <cite>— শায়খ আহমাদুল্লাহ, প্রতিষ্ঠাতা</cite>
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
          BEFORE→AFTER — Transformation Stories
          ════════════════════════════════════ */}
      <section className={styles.transformSection}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionStagger}
          >
            <motion.div className={styles.sectionBadge} variants={fadeUp}>
              <TrophyIcon size={15} color="var(--color-primary-600)" />
              <span>জীবন বদলের গল্প</span>
            </motion.div>
            <motion.h2 className="heading-md" variants={fadeUp}>
              প্রশিক্ষণ নিয়ে <span className="gradient-text">জীবন বদলেছেন</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className={styles.transformGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={sectionStagger}
          >
            {[
              { name: "আব্দুল্লাহ আল মামুন", before: "বেকার যুবক", after: "নিজের ব্যবসা, মাসে ৩০,০০০+ আয়", course: "স্মল বিজনেস", color: "#1B8A50" },
              { name: "ফাতেমা খাতুন", before: "গ্রাম থেকে আসা, কোনো কাজ নেই", after: "টেইলারিং ব্যবসার মালিক", course: "স্মার্ট টেইলারিং", color: "#AD1457" },
              { name: "মোহাম্মদ হাসান", before: "দিনমজুর, অনিশ্চিত আয়", after: "রেস্টুরেন্ট শেফ, স্থায়ী চাকরি", course: "শেফ ট্রেনিং", color: "#E65100" },
            ].map((t, i) => (
              <motion.div key={i} className={styles.transformCard} variants={fadeUp}>
                <div className={styles.transformBefore}>
                  <span>আগে</span>
                  <p>{t.before}</p>
                </div>
                <div className={styles.transformArrow}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-500)" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
                <div className={styles.transformAfter}>
                  <span>এখন</span>
                  <p>{t.after}</p>
                </div>
                <div className={styles.transformFooter}>
                  <strong>{t.name}</strong>
                  <span style={{ color: t.color }}>{t.course}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.transformCta}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/stories" className={styles.viewAllBtn}>
              <ArrowRightIcon size={15} color="var(--color-dark-bg)" />
              সকল সাফল্যের গল্প দেখুন
            </Link>
          </motion.div>
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
            <motion.p className="section-subtitle" style={{ color: "rgba(255, 255, 255, 0.45)" }} variants={fadeUp}>
              যারা আস-সুন্নাহ থেকে প্রশিক্ষণ নিয়ে জীবন বদলে ফেলেছেন
            </motion.p>
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
                    {testimonials[activeTestimonial]?.text}
                  </p>
                  <div className={styles.testimonialStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} size={16} color="var(--color-accent-400)" />
                    ))}
                  </div>
                  <div className={styles.testimonialFeaturedAuthor}>
                    <div className={styles.testimonialAvatar}>
                      <span>{testimonials[activeTestimonial]?.initials}</span>
                    </div>
                    <div>
                      <strong>{testimonials[activeTestimonial]?.name}</strong>
                      <span className={styles.testimonialBatch}>
                        {testimonials[activeTestimonial]?.batch}
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
                .map((t) => (
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

          {/* Trust indicators */}
          <motion.div className={styles.ctaTrust} variants={fadeUp}>
            <div className={styles.ctaTrustItem}>
              <ShieldCheckIcon size={16} color="var(--color-secondary-400)" />
              <span>NSDA নিবন্ধিত</span>
            </div>
            <div className={styles.ctaTrustDot} />
            <div className={styles.ctaTrustItem}>
              <GraduationIcon size={16} color="var(--color-secondary-400)" />
              <span>২,৫০০+ গ্র্যাজুয়েট</span>
            </div>
            <div className={styles.ctaTrustDot} />
            <div className={styles.ctaTrustItem}>
              <HeartIcon size={16} color="var(--color-secondary-400)" />
              <span>১০০% স্কলারশিপ</span>
            </div>
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
