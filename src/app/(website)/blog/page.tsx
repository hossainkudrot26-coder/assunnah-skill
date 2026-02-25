"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getPublishedPosts, getFeaturedPost } from "@/lib/actions/blog";
import { PageHeader } from "@/shared/components/PageHeader";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "@/shared/components/Icons";
import { images } from "@/config/images";
import styles from "./blog.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("সব");

  useEffect(() => {
    Promise.all([
      getPublishedPosts(1, 20),
      getFeaturedPost(),
    ]).then(([postsData, featuredPost]) => {
      setPosts(postsData.posts.filter((p: any) => p.id !== featuredPost?.id));
      setFeatured(featuredPost || postsData.posts[0] || null);
      setLoading(false);
    });
  }, []);

  // Fallback to static data if DB is empty
  const staticPosts = [
    { id: "1", slug: "batch-16-admission", title: "ব্যাচ ১৬-তে ভর্তি চলছে — আজই আবেদন করুন", excerpt: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটে ব্যাচ ১৬-তে ভর্তি কার্যক্রম শুরু হয়েছে।", category: "ভর্তি", readTime: "৩ মিনিট", image: images.blog.admission, publishedAt: "2026-02-15" },
    { id: "2", slug: "nsda-certification-2025", title: "NSDA সনদপত্র — জাতীয় স্বীকৃতির মাইলফলক", excerpt: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA) কর্তৃক আনুষ্ঠানিক নিবন্ধন।", category: "অর্জন", readTime: "৫ মিনিট", image: images.blog.nsda, publishedAt: "2026-01-28" },
    { id: "3", slug: "success-stories-batch-14", title: "ব্যাচ ১৪ থেকে ৮৫% শিক্ষার্থী কর্মসংস্থান পেয়েছে", excerpt: "সম্প্রতি সমাপ্ত ব্যাচ ১৪ এর শিক্ষার্থীদের ৮৫% কর্মসংস্থান পেয়েছে।", category: "সাফল্য", readTime: "৪ মিনিট", image: images.blog.success, publishedAt: "2026-01-10" },
    { id: "4", slug: "scholarship-announcement", title: "১০০% স্কলারশিপে প্রশিক্ষণের সুযোগ", excerpt: "সুবিধাবঞ্চিত ও মেধাবী শিক্ষার্থীদের জন্য বিনামূল্যে প্রশিক্ষণের সুযোগ।", category: "স্কলারশিপ", readTime: "৩ মিনিট", image: images.blog.scholarship, publishedAt: "2026-01-05" },
    { id: "5", slug: "new-branch-construction", title: "আফতাবনগরে নতুন ব্রাঞ্চ নির্মাণ চলছে", excerpt: "৩২,৫০০ বর্গফুটের নতুন প্রশিক্ষণ কেন্দ্র নির্মাণ করা হচ্ছে।", category: "সংবাদ", readTime: "৪ মিনিট", image: images.blog.newBranch, publishedAt: "2025-12-20" },
    { id: "6", slug: "free-web-bootcamp", title: "ফ্রি ওয়েব ডেভেলপমেন্ট বুটক্যাম্পে ১০,৯৬২ জন অংশগ্রহণ", excerpt: "রেকর্ড সংখ্যক শিক্ষার্থী অংশগ্রহণ করেছে।", category: "কোর্স", readTime: "৩ মিনিট", image: images.blog.webdev, publishedAt: "2025-12-01" },
  ];

  const displayPosts = posts.length > 0 ? posts : staticPosts.slice(1);
  const displayFeatured = featured || staticPosts[0];

  // Categories
  const allPosts = posts.length > 0 ? posts : staticPosts;
  const categories = useMemo(() => {
    const cats = [...new Set(allPosts.map((p: any) => p.category || "সংবাদ"))];
    return ["সব", ...cats];
  }, [allPosts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    let result = displayPosts;
    if (activeCategory !== "সব") {
      result = result.filter((p: any) => (p.category || "সংবাদ") === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p: any) =>
        p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [displayPosts, activeCategory, search]);

  function formatDate(date: string | Date) {
    try {
      return new Date(date).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
    } catch { return "—"; }
  }

  return (
    <>
      <PageHeader
        title="ব্লগ ও সংবাদ"
        subtitle="প্রশিক্ষণ, ভর্তি ও প্রতিষ্ঠানের সর্বশেষ খবর"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "ব্লগ" }]}
        badge={{ icon: <CalendarIcon size={14} color="var(--color-secondary-300)" />, text: "সংবাদ" }}
      />

      <section className={styles.blogSection}>
        <div className="container">
          {loading ? (
            <p style={{ textAlign: "center", color: "var(--color-neutral-500)", padding: "40px" }}>লোড হচ্ছে...</p>
          ) : (
            <>
              {/* Featured */}
              {displayFeatured && (
                <Link href={`/blog/${displayFeatured.slug}`} className={styles.featuredPost}>
                  <div className={styles.featuredImage}>
                    <Image
                      src={displayFeatured.image || images.blog.admission}
                      alt={displayFeatured.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className={styles.featuredImg}
                    />
                  </div>
                  <div className={styles.featuredContent}>
                    <span className={styles.postCategory}>{displayFeatured.category || "সংবাদ"}</span>
                    <h2>{displayFeatured.title}</h2>
                    <p>{displayFeatured.excerpt}</p>
                    <div className={styles.postMeta}>
                      <span>
                        <CalendarIcon size={14} color="var(--color-neutral-400)" />
                        {formatDate(displayFeatured.publishedAt)}
                      </span>
                      <span>
                        <ClockIcon size={14} color="var(--color-neutral-400)" />
                        {displayFeatured.readTime || "৩ মিনিট"}
                      </span>
                    </div>
                    <span className={styles.readMore}>
                      বিস্তারিত পড়ুন
                      <ArrowRightIcon size={14} color="var(--color-primary-500)" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Search + Filter */}
              <div className={styles.searchFilter}>
                <div className={styles.searchBox}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="পোস্ট খুঁজুন..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.categoryChips}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`${styles.categoryChip} ${activeCategory === cat ? styles.categoryChipActive : ""}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className={styles.postsGrid}>
                <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                  <motion.div key={post.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link href={`/blog/${post.slug}`} className={styles.postCard}>
                    <div className={styles.postImageWrap}>
                      <Image
                        src={post.image || images.blog.admission}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.postImg}
                      />
                    </div>
                    <div className={styles.postContent}>
                      <span className={styles.postCategory}>{post.category || "সংবাদ"}</span>
                      <h3>{post.title}</h3>
                      <div className={styles.postMeta}>
                        <span>
                          <CalendarIcon size={13} color="var(--color-neutral-400)" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span>
                          <ClockIcon size={13} color="var(--color-neutral-400)" />
                          {post.readTime || "৩ মিনিট"}
                        </span>
                      </div>
                    </div>
                  </Link>
                  </motion.div>
                ))}
                </AnimatePresence>
                {filteredPosts.length === 0 && (
                  <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--color-neutral-400)", padding: "40px" }}>
                    কোনো পোস্ট পাওয়া যায়নি
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
