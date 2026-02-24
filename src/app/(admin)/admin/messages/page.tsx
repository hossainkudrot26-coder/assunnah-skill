"use client";

import { useEffect, useState } from "react";
import { getContactMessages, markMessageAsRead } from "@/lib/actions/contact";
import styles from "./messages.module.css";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactMessages(1, 50).then((data) => {
      setMessages(data.messages);
      setLoading(false);
    });
  }, []);

  async function handleMarkRead(id: string) {
    await markMessageAsRead(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "READ" } : m))
    );
  }

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.messagesPage}>
      <div className={styles.header}>
        <h2>যোগাযোগ মেসেজ</h2>
        <span className={styles.count}>{messages.length} টি মেসেজ</span>
      </div>

      {messages.length === 0 ? (
        <div className={styles.empty}>
          <p>কোনো মেসেজ নেই</p>
        </div>
      ) : (
        <div className={styles.messagesList}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageCard} ${msg.status === "UNREAD" ? styles.unread : ""}`}
            >
              <div className={styles.messageTop}>
                <div>
                  <strong>{msg.name}</strong>
                  <span className={styles.phone}>{msg.phone}</span>
                  {msg.email && <span className={styles.email}>{msg.email}</span>}
                </div>
                <div className={styles.messageActions}>
                  <span className={styles.date}>
                    {new Date(msg.createdAt).toLocaleDateString("bn-BD")}
                  </span>
                  {msg.status === "UNREAD" && (
                    <button onClick={() => handleMarkRead(msg.id)} className={styles.markReadBtn}>
                      পড়া হয়েছে
                    </button>
                  )}
                </div>
              </div>
              {msg.subject && <span className={styles.subject}>{msg.subject}</span>}
              <p className={styles.messageBody}>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
