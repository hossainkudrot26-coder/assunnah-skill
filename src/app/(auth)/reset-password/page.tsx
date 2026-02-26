"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";
import styles from "../login/login.module.css";

function ResetForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("পাসওয়ার্ড মিলছে না");
            return;
        }

        if (password.length < 6) {
            setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
            return;
        }

        setLoading(true);
        const result = await resetPassword(email, token, password);

        if (result.success) {
            setMessage(result.message || "পাসওয়ার্ড পরিবর্তন হয়েছে!");
        } else {
            setError(result.error || "সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }

        setLoading(false);
    };

    if (!token || !email) {
        return (
            <div className={styles.authPage}>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <h1>অবৈধ লিংক</h1>
                        <p>এই রিসেট লিংক অবৈধ বা মেয়াদোত্তীর্ণ।</p>
                    </div>
                    <div className={styles.authFooter}>
                        <Link href="/forgot-password">নতুন রিসেট লিংক পান →</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1>নতুন পাসওয়ার্ড</h1>
                    <p>আপনার নতুন পাসওয়ার্ড সেট করুন</p>
                </div>

                {message && (
                    <div className={styles.successMsg}>
                        {message}
                        <br />
                        <Link href="/login" style={{ fontWeight: 600 }}>এখন লগইন করুন →</Link>
                    </div>
                )}
                {error && <div className={styles.errorMsg}>{error}</div>}

                {!message && (
                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">নতুন পাসওয়ার্ড</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="কমপক্ষে ৬ অক্ষর"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="আবার পাসওয়ার্ড দিন"
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className={styles.authPage}><div className={styles.authCard}>লোড হচ্ছে...</div></div>}>
            <ResetForm />
        </Suspense>
    );
}
