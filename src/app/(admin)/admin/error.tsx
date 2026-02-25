"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{
      maxWidth: 500,
      margin: "40px auto",
      padding: 32,
      background: "white",
      borderRadius: 16,
      border: "1px solid #e5e7eb",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8, color: "#1f2937" }}>
        সমস্যা হয়েছে
      </h2>
      <p style={{ fontSize: "0.88rem", color: "#6b7280", marginBottom: 20 }}>
        এই পেজে একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "8px 20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "white",
            background: "#1B8A50",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          আবার চেষ্টা
        </button>
        <Link
          href="/admin"
          style={{
            padding: "8px 20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#6b7280",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          ড্যাশবোর্ড
        </Link>
      </div>
    </div>
  );
}
