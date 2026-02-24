"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/lib/actions/blog";
import styles from "../messages/messages.module.css";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts(1, 50).then((data) => { setPosts(data.posts); setLoading(false); });
  }, []);

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.messagesPage}>
      <div className={styles.header}>
        <h2>ব্লগ পোস্ট</h2>
        <span className={styles.count}>{posts.length} টি পোস্ট</span>
      </div>
      {posts.length === 0 ? (
        <div className={styles.empty}><p>কোনো পোস্ট নেই</p></div>
      ) : (
        <div className={styles.messagesList}>
          {posts.map((p: any) => (
            <div key={p.id} className={styles.messageCard}>
              <div className={styles.messageTop}>
                <div>
                  <strong>{p.title}</strong>
                  {p.category && <span className={styles.phone}>{p.category}</span>}
                </div>
                <div className={styles.messageActions}>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px", borderRadius: "6px",
                    background: p.status === "PUBLISHED" ? "#F0FDF4" : "#FEF3C7",
                    color: p.status === "PUBLISHED" ? "#16A34A" : "#D97706",
                  }}>
                    {p.status === "PUBLISHED" ? "প্রকাশিত" : "ড্রাফট"}
                  </span>
                  <span className={styles.date}>
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("bn-BD") : "—"}
                  </span>
                </div>
              </div>
              {p.excerpt && <p className={styles.messageBody}>{p.excerpt}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
