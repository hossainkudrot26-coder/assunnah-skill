import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircleIcon, AwardIcon, ArrowRightIcon, QuoteIcon } from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import { AnimatedSection, AnimatedItem } from "@/shared/components/AnimatedSection";
import styles from "./stories.module.css";

export const metadata: Metadata = {
  title: "সাফল্যের গল্প — আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট",
  description: "আমাদের সফল শিক্ষার্থীদের অনুপ্রেরণামূলক গল্পসমূহ — প্রশিক্ষণ নিয়ে কিভাবে তারা জীবন বদলেছেন",
};

const stories = [
  {
    name: "আব্দুল্লাহ আল মামুন",
    batch: "স্মল বিজনেস ম্যানেজমেন্ট — ব্যাচ ৩",
    initials: "আম",
    story: "আমি একজন বেকার যুবক ছিলাম। আস-সুন্নাহ স্কিলে স্মল বিজনেস ম্যানেজমেন্ট কোর্সে ভর্তি হই। কোর্সে গ্রাফিক ডিজাইন ও ডিজিটাল মার্কেটিং শিখি। এখন আমি নিজের অনলাইন ব্যবসা চালাচ্ছি এবং মাসে ভালো আয় করছি। এই প্রশিক্ষণ আমার জীবন বদলে দিয়েছে।",
    achievement: "নিজের অনলাইন ব্যবসা",
    color: "#1B8A50",
  },
  {
    name: "ফাতেমা খাতুন",
    batch: "স্মার্ট টেইলারিং — ব্যাচ ২",
    initials: "ফখ",
    story: "আমি গ্রাম থেকে ঢাকায় এসে কোনো কাজ খুঁজে পাচ্ছিলাম না। আস-সুন্নাহ স্কিলে স্মার্ট টেইলারিং কোর্সে সম্পূর্ণ বিনামূল্যে ভর্তি হই। এখন আমি নিজের বাড়িতে বসে টেইলারিং ব্যবসা চালাচ্ছি। প্রতিমাসে ১৫-২০ হাজার টাকা আয় করছি।",
    achievement: "নিজস্ব টেইলারিং ব্যবসা",
    color: "#AD1457",
  },
  {
    name: "মোহাম্মদ হাসান",
    batch: "শেফ ট্রেনিং — ব্যাচ ১",
    initials: "মহ",
    story: "শেফ ট্রেনিং কোর্স আমার জীবন বদলে দিয়েছে। আমি এখন একটি নামকরা রেস্টুরেন্টে শেফ হিসেবে কাজ করছি। আমার মাসিক আয় এখন অনেক ভালো। এই সুন্দর সুযোগের জন্য আস-সুন্নাহ স্কিলের প্রতি কৃতজ্ঞ।",
    achievement: "রেস্টুরেন্ট শেফ হিসেবে কর্মরত",
    color: "#E65100",
  },
  {
    name: "রাহিমা বেগম",
    batch: "সেলস ও মার্কেটিং — ব্যাচ ১",
    initials: "রব",
    story: "সেলস ও মার্কেটিং কোর্সের মাধ্যমে আমি কমিউনিকেশন স্কিল ও ব্র্যান্ডিং শিখেছি। এখন আমি একটি কোম্পানিতে মার্কেটিং এক্সিকিউটিভ হিসেবে কাজ করছি। নারী হিসেবে আত্মনির্ভরশীল হতে পেরেছি।",
    achievement: "মার্কেটিং এক্সিকিউটিভ",
    color: "#1565C0",
  },
  {
    name: "মোস্তাফিজুর রহমান",
    batch: "ওয়েব ডেভেলপমেন্ট — ব্যাচ ১",
    initials: "মর",
    story: "অনলাইন ওয়েব ডেভেলপমেন্ট কোর্সে HTML, CSS, JavaScript ও React শিখেছি। এখন ফ্রিল্যান্সিং করে ভালো আয় করছি। বিদেশি ক্লায়েন্টদের জন্য ওয়েবসাইট তৈরি করি।",
    achievement: "ফ্রিল্যান্স ওয়েব ডেভেলপার",
    color: "#6A1B9A",
  },
  {
    name: "আবু বকর সিদ্দিক",
    batch: "ড্রাইভিং ট্রেনিং — ব্যাচ ৫",
    initials: "আস",
    story: "ড্রাইভিং ট্রেনিং নিয়ে এখন একটি কোম্পানিতে ড্রাইভার হিসেবে কাজ করছি। ট্রাফিক আইন ও রোড সেফটি সম্পর্কে পূর্ণ ধারণা আছে। পরিবার চালাতে পারছি এখন।",
    achievement: "পেশাদার ড্রাইভার",
    color: "#2E7D32",
  },
];

export default function StoriesPage() {
  return (
    <>
      <PageHeader
        title="যারা বদলেছেন নিজেদের ভাগ্য"
        subtitle="আমাদের শিক্ষার্থীরা কিভাবে প্রশিক্ষণ নিয়ে জীবন বদলে দিয়েছেন"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "সাফল্যের গল্প" },
        ]}
        badge={{ icon: <MessageCircleIcon size={14} color="var(--color-secondary-300)" />, text: "সাফল্যের গল্প" }}
      />

      <section className={styles.storiesSection}>
        <div className="container">
          <AnimatedSection className={styles.storiesGrid}>
            {stories.map((s, i) => (
              <AnimatedItem key={i} className={styles.storyCard}>
                <div className={styles.quoteIcon}>
                  <QuoteIcon size={24} color={`${s.color}30`} />
                </div>
                <div className={styles.storyHeader}>
                  <div
                    className={styles.storyAvatar}
                    style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)` }}
                  >
                    <span>{s.initials}</span>
                  </div>
                  <div>
                    <h3>{s.name}</h3>
                    <span className={styles.storyBatch}>{s.batch}</span>
                  </div>
                </div>
                <p className={styles.storyText}>{s.story}</p>
                <div
                  className={styles.storyAchievement}
                  style={{ background: `${s.color}0C`, color: s.color, borderColor: `${s.color}20` }}
                >
                  <AwardIcon size={15} color={s.color} />
                  {s.achievement}
                </div>
              </AnimatedItem>
            ))}
          </AnimatedSection>

          {/* CTA */}
          <div className={styles.storiesCta}>
            <h3>আপনিও কি আমাদের শিক্ষার্থী?</h3>
            <p>আপনার সাফল্যের গল্প আমাদের সাথে শেয়ার করুন</p>
            <Link href="/contact" className={styles.ctaBtn}>
              গল্প শেয়ার করুন
              <ArrowRightIcon size={15} color="white" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
