"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getProfileData, updateProfile, changePassword } from "@/lib/actions/auth";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  useEffect(() => {
    if (!session?.user?.id) { setLoading(false); return; }
    getProfileData(session.user.id).then((data) => {
      setProfile(data);
      setFormName(data?.name || "");
      setFormPhone(data?.phone || "");
      setLoading(false);
    });
  }, [session?.user?.id]);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveProfile = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    const result = await updateProfile(session.user.id, { name: formName, phone: formPhone });
    if (result.success) {
      showMsg("success", result.message!);
      setEditing(false);
      setProfile((prev: any) => ({ ...prev, name: formName, phone: formPhone }));
      updateSession({ name: formName });
    } else {
      showMsg("error", result.error!);
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!session?.user?.id) return;
    if (newPw !== confirmPw) { showMsg("error", "পাসওয়ার্ড মিলছে না"); return; }
    setSaving(true);
    const result = await changePassword(session.user.id, { currentPassword: currentPw, newPassword: newPw });
    if (result.success) {
      showMsg("success", result.message!);
      setChangingPw(false);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } else {
      showMsg("error", result.error!);
    }
    setSaving(false);
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "সুপার অ্যাডমিন";
      case "ADMIN": return "অ্যাডমিন";
      default: return "শিক্ষার্থী";
    }
  };

  if (loading) return <p style={{ color: "var(--color-neutral-500)", padding: 20 }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.profilePage}>
      {message && (
        <div className={`${styles.toast} ${message.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {message.text}
        </div>
      )}

      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{profile?.name?.charAt(0) || "U"}</div>
        <div>
          <h2>{profile?.name}</h2>
          <p>{profile?.email}</p>
          <span className={styles.roleBadge}>{roleLabel(profile?.role)}</span>
        </div>
      </div>

      {/* Personal Info */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <h3>ব্যক্তিগত তথ্য</h3>
          {!editing && (
            <button className={styles.editBtn} onClick={() => setEditing(true)}>সম্পাদনা</button>
          )}
        </div>

        {editing ? (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>নাম</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>ফোন</label>
              <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="01XXXXXXXXX" />
            </div>
            <div className={styles.formGroup}>
              <label>ইমেইল</label>
              <input value={profile?.email || ""} disabled style={{ opacity: 0.6 }} />
            </div>
            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={() => { setEditing(false); setFormName(profile?.name); setFormPhone(profile?.phone || ""); }}>
                বাতিল
              </button>
              <button className={styles.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                {saving ? "সেভ হচ্ছে..." : "সংরক্ষণ"}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>নাম</label>
              <span>{profile?.name || "—"}</span>
            </div>
            <div className={styles.infoItem}>
              <label>ইমেইল</label>
              <span>{profile?.email || "—"}</span>
            </div>
            <div className={styles.infoItem}>
              <label>ফোন</label>
              <span>{profile?.phone || "—"}</span>
            </div>
            <div className={styles.infoItem}>
              <label>ভূমিকা</label>
              <span>{roleLabel(profile?.role)}</span>
            </div>
            {profile?.gender && (
              <div className={styles.infoItem}>
                <label>লিঙ্গ</label>
                <span>{profile.gender === "MALE" ? "পুরুষ" : "নারী"}</span>
              </div>
            )}
            {profile?.address && (
              <div className={styles.infoItem}>
                <label>ঠিকানা</label>
                <span>{profile.address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Password Change */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <h3>নিরাপত্তা</h3>
        </div>

        {changingPw ? (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>বর্তমান পাসওয়ার্ড</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>নতুন পাসওয়ার্ড</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" />
            </div>
            <div className={styles.formGroup}>
              <label>নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </div>
            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={() => { setChangingPw(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}>
                বাতিল
              </button>
              <button className={styles.saveBtn} onClick={handleChangePassword} disabled={saving}>
                {saving ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন"}
              </button>
            </div>
          </div>
        ) : (
          <button className={styles.changePasswordBtn} onClick={() => setChangingPw(true)}>
            🔒 পাসওয়ার্ড পরিবর্তন করুন
          </button>
        )}
      </div>
    </div>
  );
}
