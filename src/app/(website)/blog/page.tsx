import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { images } from "@/config/images";
import {
  MegaphoneIcon, CalendarIcon, ClockIcon, ArrowRightIcon, UserIcon,
} from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import { AnimatedSection, AnimatedItem } from "@/shared/components/AnimatedSection";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "ব্লগ / সংবাদ",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের সাম্প্রতিক খবর, আপডেট ও প্রশিক্ষণ সংক্রান্ত তথ্য",
};

const blogPosts = [
  {
    id: 1,
    slug: "batch-16-admission",
    title: "ব্যাচ ১৬-তে ভর্তি চলছে — আজই আবেদন করুন",
    excerpt: "স্মল বিজনেস ম্যানেজমেন্ট, শেফ ট্রেনিং, সেলস ও মার্কেটিং সহ সকল কোর্সে ব্যাচ ১৬-তে ভর্তি কার্যক্রম শুরু হয়েছে। মেধাবী ও সুবিধাবঞ্চিত শিক্ষার্থীদের জন্য বিশেষ স্কলারশিপ সুবিধা।",
    image: images.blog.admission,
    date: "১৫ ফেব্রুয়ারি ২০২৬",
    readTime: "৩ মিনিট",
    category: "ভর্তি",
    featured: true,
  },
  {
    id: 2,
    slug: "nsda-certification-2025",
    title: "NSDA সনদপত্র — জাতীয় স্বীকৃতির মাইলফলক",
    excerpt: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA) কর্তৃক আনুষ্ঠানিক নিবন্ধন ও সনদপত্র প্রাপ্তি আমাদের প্রশিক্ষণের মান ও গ্রহণযোগ্যতার প্রমাণ।",
    image: images.blog.nsda,
    date: "২৮ জানুয়ারি ২০২৬",
    readTime: "৫ মিনিট",
    category: "অর্জন",
    featured: false,
  },
  {
    id: 3,
    slug: "success-stories-batch-14",
    title: "ব্যাচ ১৪ থেকে ৮৫% শিক্ষার্থী কর্মসংস্থান পেয়েছে",
    excerpt: "সম্প্রতি সমাপ্ত ব্যাচ ১৪ এর শিক্ষার্থীদের মধ্যে ৮৫% ইতিমধ্যে চাকরি বা নিজস্ব উদ্যোগে যুক্ত হয়েছেন। তাদের সাফল্যের গল্প পড়ুন।",
    image: images.blog.success,
    date: "১০ জানুয়ারি ২০২৬",
    readTime: "৪ মিনিট",
    category: "সাফল্য",
    featured: false,
  },
  {
    id: 4,
    slug: "scholarship-announcement",
    title: "১০০% স্কলারশিপে প্রশিক্ষণের সুযোগ — আবেদন চলছে",
    excerpt: "সুবিধাবঞ্চিত ও মেধাবী শিক্ষার্থীদের জন্য সম্পূর্ণ বিনামূল্যে প্রশিক্ষণের সুযোগ। আবাসন, খাবার ও প্রশিক্ষণ সামগ্রী — সবকিছু ফ্রি।",
    image: images.blog.scholarship,
    date: "৫ জানুয়ারি ২০২৬",
    readTime: "৩ মিনিট",
    category: "স্কলারশিপ",
    featured: false,
  },
  {
    id: 5,
    slug: "new-branch-construction",
    title: "আফতাবনগরে ৩২,৫০০ বর্গফুটের নতুন ব্রাঞ্চ নির্মাণ চলছে",
    excerpt: "ক্রমবর্ধমান চাহিদা মেটাতে আফতাবনগরে নতুন প্রশিক্ষণ কেন্দ্র নির্মাণ করা হচ্ছে। লক্ষ্য — বছরে ১ লক্ষ প্রশিক্ষণার্থী।",
    image: images.blog.newBranch,
    date: "২০ ডিসেম্বর ২০২৫",
    readTime: "৪ মিনিট",
    category: "সংবাদ",
    featured: false,
  },
  {
    id: 6,
    slug: "free-web-bootcamp",
    title: "ফ্রি ওয়েব ডেভেলপমেন্ট বুটক্যাম্পে ১০,৯৬২ জন অংশগ্রহণ",
    excerpt: "অনলাইনে পরিচালিত ফ্রি ওয়েব ডেভেলপমেন্ট বুটক্যাম্পে রেকর্ড সংখ্যক শিক্ষার্থী অংশগ্রহণ করেছে। পরবর্তী ব্যাচ শীঘ্রই।",
    image: images.blog.webdev,
    date: "১ ডিসেম্বর ২০২৫",
    readTime: "৩ মিনিট",
    category: "কোর্স",
    featured: false,
  },
];

const featuredPost = blogPosts.find((p) => p.featured)!;
const regularPosts = blogPosts.filter((p) => !p.featured);

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="ব্লগ / সংবাদ"
        subtitle="সাম্প্রতিক খবর, আপডেট ও প্রশিক্ষণ সংক্রান্ত তথ্য"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "ব্লগ / সংবাদ" },
        ]}
        badge={{ icon: <MegaphoneIcon size={14} color="var(--color-secondary-300)" />, text: "ব্লগ / সংবাদ" }}
      />

      <section className={styles.blogSection}>
        <div className="container">
          {/* Featured Post */}
          <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredPost}>
            <div className={styles.featuredImageWrap}>
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className={styles.featuredImage}
                priority
              />
              <span className={styles.featuredBadge}>সর্বশেষ</span>
            </div>
            <div className={styles.featuredContent}>
              <span className={styles.postCategory}>{featuredPost.category}</span>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              <div className={styles.postMeta}>
                <span>
                  <CalendarIcon size={14} color="var(--color-neutral-400)" />
                  {featuredPost.date}
                </span>
                <span>
                  <ClockIcon size={14} color="var(--color-neutral-400)" />
                  {featuredPost.readTime}
                </span>
              </div>
              <span className={styles.readMore}>
                বিস্তারিত পড়ুন
                <ArrowRightIcon size={14} color="var(--color-primary-500)" />
              </span>
            </div>
          </Link>

          {/* Post Grid */}
          <AnimatedSection className={styles.postsGrid}>
            {regularPosts.map((post) => (
              <AnimatedItem key={post.id} className={styles.postCard}>
                <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                <div className={styles.postImageWrap}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.postImage}
                  />
                </div>
                <div className={styles.postBody}>
                  <span className={styles.postCategory}>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className={styles.postMeta}>
                    <span>
                      <CalendarIcon size={13} color="var(--color-neutral-400)" />
                      {post.date}
                    </span>
                    <span>
                      <ClockIcon size={13} color="var(--color-neutral-400)" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                </Link>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
