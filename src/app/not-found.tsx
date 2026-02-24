import Link from "next/link";
import { HomeIcon, ArrowRightIcon, BookIcon, PhoneIcon } from "@/shared/components/Icons";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.background}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.pattern} />
      </div>

      <div className={styles.content}>
        <div className={styles.errorCode}>৪০৪</div>
        <h1 className={styles.title}>পাতা পাওয়া যায়নি</h1>
        <p className={styles.subtitle}>
          দুঃখিত, আপনি যে পাতাটি খুঁজছেন সেটি সরিয়ে ফেলা হয়েছে, নাম পরিবর্তন করা হয়েছে
          অথবা সাময়িকভাবে অপ্রাপ্য।
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <HomeIcon size={16} color="white" />
            মূল পাতায় ফিরে যান
          </Link>
          <Link href="/courses" className={styles.secondaryBtn}>
            <BookIcon size={16} />
            কোর্সসমূহ দেখুন
          </Link>
          <Link href="/contact" className={styles.secondaryBtn}>
            <PhoneIcon size={16} />
            যোগাযোগ
          </Link>
        </div>
      </div>
    </div>
  );
}
