"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/shared/components/Logo";
import { registerAction } from "@/lib/actions/auth";
import { LockIcon, UserIcon } from "@/shared/components/Icons";
import styles from "../login/login.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "" as "" | "MALE" | "FEMALE",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      setLoading(false);
      return;
    }

    try {
      const result = await registerAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: formData.gender || undefined,
      });

      if (result.success) {
        setSuccess(result.message || "অ্যাকাউন্ট তৈরি হয়েছে!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(result.error || "সমস্যা হয়েছে");
      }
    } catch {
      setError("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে");
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
            <Logo variant="full" height={36} />
          </div>
          <h1>নতুন অ্যাকাউন্ট তৈরি করুন</h1>
          <p>আপনার তথ্য দিয়ে রেজিস্টার করুন</p>
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

        {success && (
          <div className={styles.errorMsg} style={{ background: "var(--color-success-bg, #F0FDF4)", borderColor: "var(--color-success-border, #BBF7D0)", color: "var(--color-success-text, #16A34A)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {success}
          </div>
        )}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">পূর্ণ নাম</label>
            <input
              type="text"
              id="name"
              placeholder="আপনার নাম"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">ইমেইল</label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">ফোন নম্বর</label>
            <input
              type="tel"
              id="phone"
              placeholder="০১XXXXXXXXX"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender">লিঙ্গ</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1.5px solid var(--color-neutral-200)",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                background: "var(--color-card-bg, white)",
              }}
            >
              <option value="">নির্বাচন করুন</option>
              <option value="MALE">পুরুষ</option>
              <option value="FEMALE">মহিলা</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">পাসওয়ার্ড</label>
            <input
              type="password"
              id="password"
              placeholder="কমপক্ষে ৬ অক্ষর"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="আবার পাসওয়ার্ড দিন"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
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
                তৈরি হচ্ছে...
              </>
            ) : (
              <>
                <UserIcon size={16} color="white" />
                রেজিস্টার করুন
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
            ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login">লগইন করুন</Link>
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
