"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";
import styles from "../login/login.module.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const result = await requestPasswordReset(email);

        if (result.success) {
            setMessage(result.message || "নির্দেশনা পাঠানো হয়েছে।");
        } else {
            setError(result.error || "সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }

        setLoading(false);
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1>পাসওয়ার্ড রিসেট</h1>
                    <p>আপনার ইমেইল দিন — আমরা রিসেট লিংক পাঠাবো</p>
                </div>

                {message && <div className={styles.successMsg}>{message}</div>}
                {error && <div className={styles.errorMsg}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">ইমেইল</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="আপনার ইমেইল দিন"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <Link href="/login">← লগইন পেজে ফিরে যান</Link>
                </div>
            </div>
        </div>
    );
}
