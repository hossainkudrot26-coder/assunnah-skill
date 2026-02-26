import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  BookIcon, ShieldCheckIcon,
} from "@/shared/components/Icons";
import { getPublishedDownloads } from "@/lib/actions/download";
import styles from "./downloads.module.css";

export const metadata: Metadata = {
  title: "ডাউনলোড সেন্টার",
  description: "কোর্স সিলেবাস, ব্রোশিউর, ভর্তি ফরম এবং অন্যান্য প্রয়োজনীয় ডকুমেন্ট ডাউনলোড করুন",
};

const categoryLabels: Record<string, string> = {
  GENERAL: "সাধারণ",
  ADMISSION: "ভর্তি",
  SYLLABUS: "সিলেবাস",
};

export default async function DownloadsPage() {
  const downloads = await getPublishedDownloads();

  const hasUnavailable = downloads.some((d) => !d.fileUrl);

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
          {/* Notice — only show if some files are unavailable */}
          {hasUnavailable && (
            <div className={styles.noticeBanner}>
              <ShieldCheckIcon size={18} color="var(--color-primary-500)" />
              <p>কিছু ফাইল শীঘ্রই আপলোড করা হবে। অনলাইনে ভর্তির জন্য <Link href="/admission/apply" className={styles.noticeLink}>এখানে আবেদন করুন</Link>।</p>
            </div>
          )}

          {/* Download Grid */}
          <div className={styles.downloadGrid}>
            {downloads.map((item) => (
              <div key={item.id} className={`${styles.downloadCard} ${!item.fileUrl ? styles.cardDisabled : ""}`}>
                <div className={styles.downloadIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={item.iconColor} strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className={styles.downloadContent}>
                  <div className={styles.downloadMeta}>
                    <span className={styles.downloadType}>{item.fileType}</span>
                    <span className={styles.downloadCategory}>{categoryLabels[item.category] || item.category}</span>
                    {item.fileSize && <span className={styles.downloadSize}>{item.fileSize}</span>}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className={styles.downloadAction}>
                  {item.fileUrl ? (
                    <a href={item.fileUrl} download className={styles.downloadBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      ডাউনলোড
                    </a>
                  ) : (
                    <span className={styles.comingSoon}>শীঘ্রই আসছে</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {downloads.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-neutral-400)" }}>
              <BookIcon size={48} color="var(--color-neutral-300)" />
              <p style={{ marginTop: 16 }}>এখনো কোনো ডাউনলোড আইটেম নেই</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
