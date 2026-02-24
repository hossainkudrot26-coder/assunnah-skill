"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {session?.user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <h2>{session?.user?.name}</h2>
          <p>{session?.user?.email}</p>
          <span className={styles.roleBadge}>
            {(session?.user as any)?.role === "SUPER_ADMIN" ? "সুপার অ্যাডমিন" :
             (session?.user as any)?.role === "ADMIN" ? "অ্যাডমিন" : "শিক্ষার্থী"}
          </span>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>ব্যক্তিগত তথ্য</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>নাম</label>
            <span>{session?.user?.name || "—"}</span>
          </div>
          <div className={styles.infoItem}>
            <label>ইমেইল</label>
            <span>{session?.user?.email || "—"}</span>
          </div>
          <div className={styles.infoItem}>
            <label>ভূমিকা</label>
            <span>{(session?.user as any)?.role === "STUDENT" ? "শিক্ষার্থী" : "অ্যাডমিন"}</span>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>নিরাপত্তা</h3>
        <button className={styles.changePasswordBtn} onClick={() => alert("শীঘ্রই আসছে!")}>
          পাসওয়ার্ড পরিবর্তন করুন
        </button>
      </div>
    </div>
  );
}
