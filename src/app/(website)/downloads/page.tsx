import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  BookIcon, AwardIcon, GraduationIcon, ClipboardIcon,
  ArrowRightIcon, ShieldCheckIcon,
} from "@/shared/components/Icons";
import styles from "./downloads.module.css";

export const metadata: Metadata = {
  title: "ডাউনলোড সেন্টার",
  description: "কোর্স সিলেবাস, ব্রোশিউর, ভর্তি ফরম এবং অন্যান্য প্রয়োজনীয় ডকুমেন্ট ডাউনলোড করুন",
};

interface DownloadItem {
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  icon: React.ReactNode;
  category: string;
  available: boolean;
}

const downloads: DownloadItem[] = [
  {
    title: "ইনস্টিটিউট ব্রোশিউর",
    description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের পূর্ণাঙ্গ ব্রোশিউর — কোর্স, সুবিধা ও ভর্তি তথ্য",
    fileType: "PDF",
    fileSize: "শীঘ্রই",
    icon: <BookIcon size={24} color="var(--color-primary-500)" />,
    category: "সাধারণ",
    available: false,
  },
  {
    title: "ভর্তি আবেদন ফরম",
    description: "অফলাইনে ভর্তির জন্য আবেদন ফরম। প্রিন্ট করে পূরণ করুন এবং অফিসে জমা দিন।",
    fileType: "PDF",
    fileSize: "শীঘ্রই",
    icon: <ClipboardIcon size={24} color="#1565C0" />,
    category: "ভর্তি",
    available: false,
  },
  {
    title: "স্মল বিজনেস ম্যানেজমেন্ট — সিলেবাস",
    description: "৩ মাসব্যাপী কোর্সের বিস্তারিত সিলেবাস — ৬টি মডিউল, সাপ্তাহিক ব্রেকডাউন",
    fileType: "PDF",
    fileSize: "শীঘ্রই",
    icon: <GraduationIcon size={24} color="#1B8A50" />,
    category: "সিলেবাস",
    available: false,
  },
  {
    title: "শেফ ট্রেনিং — সিলেবাস",
    description: "শেফ ট্রেনিং অ্যান্ড কিচেন ম্যানেজমেন্ট কোর্সের বিস্তারিত পাঠ্যক্রম",
    fileType: "PDF",
    fileSize: "শীঘ্রই",
    icon: <GraduationIcon size={24} color="#E65100" />,
    category: "সিলেবাস",
    available: false,
  },
  {
    title: "সেলস ও মার্কেটিং — সিলেবাস",
    description: "দি আর্ট অব সেলস অ্যান্ড মার্কেটিং কোর্সের বিস্তারিত পাঠ্যক্রম ও মডিউল",
    fileType: "PDF",
    fileSize: "শীঘ্রই",
    icon: <GraduationIcon size={24} color="#1565C0" />,
    category: "সিলেবাস",
    available: false,
  },
  {
    title: "স্কলারশিপ আবেদন ফরম",
    description: "আর্থিক সহায়তা ও স্কলারশিপের জন্য আবেদনপত্র",
    fileType: "PDF",
    fileSize: "শীঘ্রই",
    icon: <AwardIcon size={24} color="var(--color-accent-500)" />,
    category: "ভর্তি",
    available: false,
  },
  {
    title: "NSDA সার্টিফিকেট নমুনা",
    description: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ কর্তৃক প্রদত্ত সার্টিফিকেটের নমুনা কপি",
    fileType: "PDF",
    fileSize: "শীঘ্রই",
    icon: <ShieldCheckIcon size={24} color="#2E7D32" />,
    category: "সাধারণ",
    available: false,
  },
];

const categories = ["সব", "সাধারণ", "ভর্তি", "সিলেবাস"];

export default function DownloadsPage() {
  return (
    <>
      <PageHeader
        title="ডাউনলোড সেন্টার"
        subtitle="কোর্স সিলেবাস, ব্রোশিউর, ভর্তি ফরম এবং অন্যান্য ডকুমেন্ট"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "ডাউনলোড" },
        ]}
        badge={{ icon: <BookIcon size={14} color="var(--color-secondary-300)" />, text: "ডাউনলোড সেন্টার" }}
      />

      <section className={`section ${styles.downloadsSection}`}>
        <div className="container">
          {/* Notice */}
          <div className={styles.noticeBanner}>
            <ShieldCheckIcon size={18} color="var(--color-primary-500)" />
            <p>PDF ফাইলগুলো শীঘ্রই আপলোড করা হবে। অনলাইনে ভর্তির জন্য <Link href="/admission/apply" className={styles.noticeLink}>এখানে আবেদন করুন</Link>।</p>
          </div>

          {/* Download Grid */}
          <div className={styles.downloadGrid}>
            {downloads.map((item, i) => (
              <div key={i} className={`${styles.downloadCard} ${!item.available ? styles.cardDisabled : ""}`}>
                <div className={styles.downloadIcon}>{item.icon}</div>
                <div className={styles.downloadContent}>
                  <div className={styles.downloadMeta}>
                    <span className={styles.downloadType}>{item.fileType}</span>
                    <span className={styles.downloadCategory}>{item.category}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className={styles.downloadAction}>
                  {item.available ? (
                    <button className={styles.downloadBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      ডাউনলোড
                    </button>
                  ) : (
                    <span className={styles.comingSoon}>শীঘ্রই আসছে</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
