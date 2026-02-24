"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { images } from "@/config/images";
import {
  CalendarIcon, ClockIcon, ArrowRightIcon, ArrowLeftIcon,
  UserIcon,
} from "@/shared/components/Icons";
import styles from "./blog-post.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

// Blog post data (same as listing)
const blogPosts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string[];
}> = {
  "batch-16-admission": {
    title: "ব্যাচ ১৬-তে ভর্তি চলছে — আজই আবেদন করুন",
    date: "১৫ ফেব্রুয়ারি ২০২৬",
    readTime: "৩ মিনিট",
    category: "ভর্তি",
    image: images.blog.admission,
    content: [
      "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটে ব্যাচ ১৬-তে ভর্তি কার্যক্রম শুরু হয়েছে। স্মল বিজনেস ম্যানেজমেন্ট, শেফ ট্রেনিং অ্যান্ড কিচেন ম্যানেজমেন্ট, দি আর্ট অব সেলস অ্যান্ড মার্কেটিং, স্মার্ট টেইলারিং এন্ড ফ্যাশন ডিজাইন সহ সকল কোর্সে আবেদন করা যাচ্ছে।",
      "মেধাবী ও সুবিধাবঞ্চিত শিক্ষার্থীদের জন্য রয়েছে বিশেষ স্কলারশিপ সুবিধা। আবাসন খরচে ১০০% পর্যন্ত এবং টিউশন ফি-তে ৮০% পর্যন্ত স্কলারশিপ প্রদান করা হয়।",
      "ভর্তির জন্য প্রয়োজনীয় কাগজপত্র: জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন সনদ, সর্বশেষ শিক্ষাগত সনদের ফটোকপি, পাসপোর্ট সাইজ ছবি (২ কপি), অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি।",
      "আসন সীমিত, তাই দ্রুত আবেদন করুন। ভর্তি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের হেল্পলাইনে কল করুন: +৮৮০ ৯৬১০-০০১০৮৯",
    ],
  },
  "nsda-certification-2025": {
    title: "NSDA সনদপত্র — জাতীয় স্বীকৃতির মাইলফলক",
    date: "২৮ জানুয়ারি ২০২৬",
    readTime: "৫ মিনিট",
    category: "অর্জন",
    image: images.blog.nsda,
    content: [
      "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA) কর্তৃক আনুষ্ঠানিক নিবন্ধন ও সনদপত্র প্রাপ্তি আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের জন্য একটি গুরুত্বপূর্ণ মাইলফলক।",
      "এই নিবন্ধন আমাদের প্রশিক্ষণের মান ও গ্রহণযোগ্যতার সরকারি স্বীকৃতি। NSDA সনদপ্রাপ্ত প্রতিষ্ঠান হিসেবে আমাদের শিক্ষার্থীরা এখন জাতীয়ভাবে স্বীকৃত সনদ পাবেন।",
      "NSDA নিবন্ধনের ফলে আমাদের শিক্ষার্থীদের কর্মসংস্থানের সুযোগ আরও বৃদ্ধি পাবে। সরকারি ও বেসরকারি প্রতিষ্ঠানে এই সনদের বিশেষ গুরুত্ব রয়েছে।",
    ],
  },
  "success-stories-batch-14": {
    title: "ব্যাচ ১৪ থেকে ৮৫% শিক্ষার্থী কর্মসংস্থান পেয়েছে",
    date: "১০ জানুয়ারি ২০২৬",
    readTime: "৪ মিনিট",
    category: "সাফল্য",
    image: images.blog.success,
    content: [
      "সম্প্রতি সমাপ্ত ব্যাচ ১৪ এর শিক্ষার্থীদের মধ্যে ৮৫% ইতিমধ্যে চাকরি বা নিজস্ব উদ্যোগে যুক্ত হয়েছেন। এটি আমাদের প্রশিক্ষণের কার্যকারিতার একটি দৃষ্টান্ত।",
      "স্মল বিজনেস ম্যানেজমেন্ট কোর্সের শিক্ষার্থীরা প্রধানত গ্রাফিক ডিজাইন, ডিজিটাল মার্কেটিং ও অ্যাকাউন্টিং সেক্টরে কাজ করছেন। শেফ ট্রেনিং কোর্সের শিক্ষার্থীরা বিভিন্ন নামকরা রেস্টুরেন্টে কর্মরত।",
      "আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে প্রশিক্ষণ শেষে কর্মসংস্থানের নিশ্চয়তা দেওয়া। এজন্য আমরা বিভিন্ন প্রতিষ্ঠানের সাথে চুক্তিবদ্ধ।",
    ],
  },
  "scholarship-announcement": {
    title: "১০০% স্কলারশিপে প্রশিক্ষণের সুযোগ — আবেদন চলছে",
    date: "৫ জানুয়ারি ২০২৬",
    readTime: "৩ মিনিট",
    category: "স্কলারশিপ",
    image: images.blog.scholarship,
    content: [
      "সুবিধাবঞ্চিত ও মেধাবী শিক্ষার্থীদের জন্য আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট সম্পূর্ণ বিনামূল্যে প্রশিক্ষণের সুযোগ দিচ্ছে।",
      "এই স্কলারশিপের আওতায় আবাসন, খাবার, প্রশিক্ষণ সামগ্রী — সবকিছু বিনামূল্যে প্রদান করা হয়। যোগ্যতা: HSC বা সমমান পাস, বয়স ১৮-৩০ বছর।",
      "আবেদনের শেষ তারিখ সীমিত। আগ্রহী শিক্ষার্থীরা আমাদের অফিসে সরাসরি অথবা ফোনে যোগাযোগ করুন।",
    ],
  },
  "new-branch-construction": {
    title: "আফতাবনগরে ৩২,৫০০ বর্গফুটের নতুন ব্রাঞ্চ নির্মাণ চলছে",
    date: "২০ ডিসেম্বর ২০২৫",
    readTime: "৪ মিনিট",
    category: "সংবাদ",
    image: images.blog.newBranch,
    content: [
      "ক্রমবর্ধমান চাহিদা মেটাতে আফতাবনগরে ৩২,৫০০ বর্গফুটের নতুন প্রশিক্ষণ কেন্দ্র নির্মাণ করা হচ্ছে। এই নতুন কেন্দ্রে আধুনিক কম্পিউটার ল্যাব, শেফ ট্রেনিং কিচেন, টেইলারিং ওয়ার্কশপ সহ সকল সুবিধা থাকবে।",
      "লক্ষ্য হলো বছরে ১ লক্ষ প্রশিক্ষণার্থীকে দক্ষতা প্রশিক্ষণ দেওয়া। ২০০ কাঠা জমিতে এই স্থায়ী কেন্দ্র নির্মিত হচ্ছে।",
      "নির্মাণ কাজ দ্রুত গতিতে এগিয়ে চলছে এবং ইনশাআল্লাহ শীঘ্রই এটি চালু হবে।",
    ],
  },
  "free-web-bootcamp": {
    title: "ফ্রি ওয়েব ডেভেলপমেন্ট বুটক্যাম্পে ১০,৯৬২ জন অংশগ্রহণ",
    date: "১ ডিসেম্বর ২০২৫",
    readTime: "৩ মিনিট",
    category: "কোর্স",
    image: images.blog.webdev,
    content: [
      "অনলাইনে পরিচালিত ফ্রি ওয়েব ডেভেলপমেন্ট বুটক্যাম্পে রেকর্ড সংখ্যক ১০,৯৬২ জন শিক্ষার্থী অংশগ্রহণ করেছে। এটি বাংলাদেশে অনলাইন প্রশিক্ষণের ইতিহাসে একটি উল্লেখযোগ্য ঘটনা।",
      "বুটক্যাম্পে HTML, CSS, JavaScript এবং React.js শেখানো হয়েছে। পরবর্তী ব্যাচ শীঘ্রই ঘোষণা করা হবে।",
    ],
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h1>পোস্ট পাওয়া যায়নি</h1>
        <p>আপনি যে পোস্টটি খুঁজছেন তা বিদ্যমান নেই।</p>
        <Link href="/blog" className={styles.backBtn}>
          <ArrowLeftIcon size={15} color="white" />
          ব্লগে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <article className={styles.article}>
      {/* Hero */}
      <motion.div
        className={styles.heroImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="100vw"
          className={styles.heroImg}
          priority
        />
        <div className={styles.heroOverlay} />
      </motion.div>

      <div className="container">
        <motion.div
          className={styles.articleContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {/* Back link */}
          <Link href="/blog" className={styles.backLink}>
            <ArrowLeftIcon size={14} color="currentColor" />
            সকল পোস্ট
          </Link>

          {/* Meta */}
          <span className={styles.category}>{post.category}</span>
          <h1>{post.title}</h1>

          <div className={styles.meta}>
            <span>
              <CalendarIcon size={14} color="var(--color-neutral-400)" />
              {post.date}
            </span>
            <span>
              <ClockIcon size={14} color="var(--color-neutral-400)" />
              {post.readTime} পড়তে সময় লাগবে
            </span>
            <span>
              <UserIcon size={14} color="var(--color-neutral-400)" />
              আস-সুন্নাহ স্কিল
            </span>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {post.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* CTA */}
          <div className={styles.postCta}>
            <h3>আরো জানতে চান?</h3>
            <p>আমাদের সাথে সরাসরি যোগাযোগ করুন</p>
            <div className={styles.postCtaActions}>
              <Link href="/contact" className={styles.ctaBtn}>
                যোগাযোগ করুন
                <ArrowRightIcon size={14} color="white" />
              </Link>
              <Link href="/courses" className={styles.ctaBtnOutline}>
                কোর্সসমূহ দেখুন
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
