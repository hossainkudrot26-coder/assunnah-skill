import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { courses } from "@/config/courses";
import { ShieldCheckIcon } from "@/shared/components/Icons";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo" aria-label="ফুটার">
      {/* Wave Separator */}
      <div className={styles.waveSeparator}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className={`container ${styles.footerContent}`}>
        {/* Newsletter */}
        <div className={styles.newsletterSection}>
          <div className={styles.newsletterLeft}>
            <h3 className={styles.newsletterTitle}>আপডেট পেতে যুক্ত থাকুন</h3>
            <p className={styles.newsletterDesc}>
              নতুন কোর্স, ভর্তি ও ইভেন্টের তথ্য সরাসরি পেতে আমাদের সাথে যুক্ত থাকুন
            </p>
          </div>
          <div className={styles.newsletterRight}>
            <form className={styles.newsletterForm} action="#">
              <input
                type="email"
                placeholder="আপনার ইমেইল দিন"
                className={styles.newsletterInput}
                aria-label="ইমেইল ঠিকানা"
                required
              />
              <button type="submit" className={styles.newsletterBtn} aria-label="সাবস্ক্রাইব করুন">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22,2 15,22 11,13 2,9" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <Image
                src="/images/logo-real.png"
                alt="আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট"
                width={160}
                height={40}
                className={styles.footerLogoImage}
              />
            </div>
            <p className={styles.footerBrandDesc}>{siteConfig.description}</p>

            {/* NSDA Badge */}
            <div className={styles.nsdaBadge}>
              <ShieldCheckIcon size={16} color="var(--color-secondary-400)" />
              <span>NSDA নিবন্ধিত প্রতিষ্ঠান</span>
            </div>

            <div className={styles.socialLinks}>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="ফেসবুক পেজ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="ইউটিউব চ্যানেল">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" />
                  <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="white" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>দ্রুত লিংক</h4>
            <nav aria-label="ফুটার নেভিগেশন">
              {[
                { href: "/about", label: "আমাদের সম্পর্কে" },
                { href: "/courses", label: "কোর্সসমূহ" },
                { href: "/admission", label: "ভর্তি প্রক্রিয়া" },
                { href: "/scholarship", label: "স্কলারশিপ" },
                { href: "/notices", label: "নোটিশ বোর্ড" },
                { href: "/events", label: "ইভেন্ট" },
                { href: "/blog", label: "ব্লগ / সংবাদ" },
                { href: "/contact", label: "যোগাযোগ" },
                { href: "/quiz", label: "কোর্স ফাইন্ডার" },
                { href: "/downloads", label: "ডাউনলোড সেন্টার" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className={styles.footerLink}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="9,6 15,12 9,18" />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Courses */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>জনপ্রিয় কোর্স</h4>
            {courses.map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className={styles.footerLink}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="9,6 15,12 9,18" />
                </svg>
                {course.title}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>যোগাযোগ</h4>
            <div className={styles.contactItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{siteConfig.contact.address}</span>
            </div>
            <a href={`tel:${siteConfig.contact.phone.replace(/[\s-]/g, "")}`} className={styles.contactItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>{siteConfig.contact.phone}</span>
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className={styles.contactItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{siteConfig.contact.email}</span>
            </a>

            {/* Working Hours */}
            <div className={styles.workingHours}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <div>
                <span>শনিবার — বৃহস্পতিবার</span>
                <span>সকাল ৯:০০ — বিকাল ৫:০০</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} {siteConfig.shortNameBn}. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className={styles.footerBottomRight}>
            <span className={styles.footerParent}>{siteConfig.parentOrg} এর একটি প্রকল্প</span>
            <span className={styles.footerDivider} />
            <span className={styles.footerEst}>প্রতিষ্ঠা: {siteConfig.established}</span>
          </div>
        </div>
      </div>

      <div className={styles.footerDecor1} />
      <div className={styles.footerDecor2} />
    </footer>
  );
}
