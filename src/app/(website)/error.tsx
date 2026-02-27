"use client";

import Link from "next/link";

export default function WebsiteError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
        }}>
            <div style={{
                maxWidth: 480,
                width: "100%",
                padding: 40,
                background: "var(--color-neutral-50, #f9fafb)",
                borderRadius: 20,
                border: "1px solid var(--color-neutral-200, #e5e7eb)",
                textAlign: "center",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>😔</div>
                <h2 style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    marginBottom: 8,
                    color: "var(--color-neutral-900, #111827)",
                }}>
                    কিছু একটা সমস্যা হয়েছে
                </h2>
                <p style={{
                    fontSize: "0.9rem",
                    color: "var(--color-neutral-500, #6b7280)",
                    marginBottom: 24,
                    lineHeight: 1.6,
                }}>
                    পেজটি লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।
                </p>
                {process.env.NODE_ENV === "development" && error?.message && (
                    <pre style={{
                        fontSize: "0.75rem",
                        padding: 12,
                        background: "var(--color-neutral-100, #f3f4f6)",
                        borderRadius: 8,
                        color: "var(--color-neutral-600, #4b5563)",
                        textAlign: "left",
                        overflow: "auto",
                        marginBottom: 20,
                        maxHeight: 120,
                    }}>
                        {error.message}
                    </pre>
                )}
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                        onClick={reset}
                        style={{
                            padding: "10px 24px",
                            fontSize: "0.88rem",
                            fontWeight: 700,
                            color: "white",
                            background: "var(--color-primary-500, #1B8A50)",
                            border: "none",
                            borderRadius: 12,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                    >
                        আবার চেষ্টা করুন
                    </button>
                    <Link
                        href="/"
                        style={{
                            padding: "10px 24px",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            color: "var(--color-neutral-600, #4b5563)",
                            background: "var(--color-neutral-100, #f3f4f6)",
                            border: "1px solid var(--color-neutral-200, #e5e7eb)",
                            borderRadius: 12,
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                        }}
                    >
                        হোমে ফিরে যান
                    </Link>
                </div>
            </div>
        </div>
    );
}
