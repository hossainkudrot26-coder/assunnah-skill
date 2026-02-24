"use client";

import Link from "next/link";
import Image from "next/image";
import { LockIcon } from "@/shared/components/Icons";
import styles from "./login.module.css";

export default function LoginPage() {
    return (
        <div className={styles.loginPage}>
            <div className={styles.loginBackground}>
                <div className={styles.loginGlow} />
                <div className={styles.loginGlow2} />
            </div>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <div className={styles.loginLogo}>
                        <Image
                            src="/images/logo-real.png"
                            alt="আস-সুন্নাহ স্কিল"
                            width={140}
                            height={35}
                            className={styles.loginLogoImage}
                        />
                    </div>
                    <h1>কমিউনিটিতে স্বাগতম</h1>
                    <p>আপনার ফোন নম্বর দিয়ে লগইন করুন</p>
                </div>

                <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">ফোন নম্বর</label>
                        <div className={styles.phoneInput}>
                            <span className={styles.phonePrefix}>+৮৮০</span>
                            <input type="tel" id="phone" placeholder="১XXXXXXXXX" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        OTP পাঠান
                    </button>
                </form>

                <div className={styles.loginInfo}>
                    <p className={styles.loginSecure}>
                        <LockIcon size={14} color="var(--color-neutral-400)" />
                        আপনার তথ্য সম্পূর্ণ নিরাপদ
                    </p>
                    <p className={styles.loginNote}>
                        কমিউনিটি ফিচার — শীঘ্রই আসছে। এখানে আপনি ব্যাচ গ্রুপ, ইভেন্ট, মেসেজিং ও ফর্মের সুবিধা পাবেন।
                    </p>
                </div>

                <Link href="/" className={styles.backLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    মূল পাতায় ফিরে যান
                </Link>
            </div>
        </div>
    );
}
