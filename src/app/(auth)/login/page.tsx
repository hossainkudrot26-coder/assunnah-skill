"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { LockIcon } from "@/shared/components/Icons";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
      } else {
        router.push("/hub");
        router.refresh();
      }
    } catch {
      setError("লগইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

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
          <p>আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন</p>
        </div>

        {error && (
          <div className={styles.errorMsg}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">ইমেইল</label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">পাসওয়ার্ড</label>
            <input
              type="password"
              id="password"
              placeholder="আপনার পাসওয়ার্ড"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                লগইন হচ্ছে...
              </>
            ) : (
              <>
                <LockIcon size={16} color="white" />
                লগইন করুন
              </>
            )}
          </button>
        </form>

        <div className={styles.loginInfo}>
          <p className={styles.loginSecure}>
            <LockIcon size={14} color="var(--color-neutral-400)" />
            আপনার তথ্য সম্পূর্ণ নিরাপদ
          </p>
          <p className={styles.registerLink}>
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register">রেজিস্টার করুন</Link>
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
