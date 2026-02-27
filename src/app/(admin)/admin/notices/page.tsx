"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAdminNotices, createNotice, updateNotice, deleteNotice, toggleNoticePublish,
} from "@/lib/actions/notice";
import styles from "../admin-dashboard.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type NoticeType = "ADMISSION" | "EXAM" | "RESULT" | "EVENT" | "GENERAL";

interface NoticeItem {
  id: string;
  title: string;
  description: string;
  type: NoticeType;
  isImportant: boolean;
  isPublished: boolean;
  link: string | null;
  publishedAt: Date;
}

interface NoticeFormData {
  title: string;
  description: string;
  type: NoticeType;
  isImportant: boolean;
  isPublished: boolean;
  link: string;
}

const typeLabels: Record<NoticeType, string> = {
  ADMISSION: "ভর্তি", EXAM: "পরীক্ষা", RESULT: "ফলাফল",
  EVENT: "ইভেন্ট", GENERAL: "সাধারণ",
};

const emptyForm: NoticeFormData = {
  title: "", description: "", type: "GENERAL",
  isImportant: false, isPublished: true, link: "",
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AdminNotices() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NoticeFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getAdminNotices();
    setNotices(data as NoticeItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function resetForm() {
    setForm(emptyForm); setEditingId(null); setShowForm(false); setError("");
  }

  function startEdit(notice: NoticeItem) {
    setForm({
      title: notice.title, description: notice.description,
      type: notice.type, isImportant: notice.isImportant,
      isPublished: notice.isPublished, link: notice.link || "",
    });
    setEditingId(notice.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError("শিরোনাম ও বিবরণ আবশ্যক"); return;
    }
    setSaving(true); setError("");
    const payload = {
      title: form.title, description: form.description,
      type: form.type, isImportant: form.isImportant,
      isPublished: form.isPublished, link: form.link || undefined,
    };
    const result = editingId
      ? await updateNotice(editingId, payload)
      : await createNotice(payload);
    if (result.success) {
      setSuccess(editingId ? "নোটিশ আপডেট হয়েছে!" : "নোটিশ তৈরি হয়েছে!");
      resetForm(); loadData();
      setTimeout(() => setSuccess(""), 3000);
    } else { setError(result.error || "সমস্যা হয়েছে"); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("এই নোটিশটি মুছে ফেলতে চান?")) return;
    const result = await deleteNotice(id);
    if (result.success) loadData();
  }

  async function handleTogglePublish(id: string, current: boolean) {
    await toggleNoticePublish(id, !current);
    loadData();
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>নোটিশ ব্যবস্থাপনা</h1>
        </div>
        <div className={styles.emptyState}>লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>নোটিশ ব্যবস্থাপনা</h1>
          <p className={styles.pageSubtitle}>মোট {notices.length}টি নোটিশ</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => { resetForm(); setShowForm(true); }}>
          + নতুন নোটিশ
        </button>
      </div>

      {success && <div className={styles.alertSuccess}>{success}</div>}

      {/* Form */}
      {showForm && (
        <div className={styles.card}>
          <h2 className={styles.formTitle}>{editingId ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ"}</h2>
          {error && <div className={styles.formError}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div>
                <label className={styles.formLabel}>শিরোনাম *</label>
                <input className={styles.formInput} type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="নোটিশের শিরোনাম" required />
              </div>

              <div>
                <label className={styles.formLabel}>বিবরণ *</label>
                <textarea className={styles.formTextarea} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="নোটিশের বিবরণ" rows={4} required />
              </div>

              <div className={styles.formRow3}>
                <div>
                  <label className={styles.formLabel}>ক্যাটাগরি</label>
                  <select className={styles.formSelect} value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as NoticeType })}>
                    {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>লিংক (ঐচ্ছিক)</label>
                  <input className={styles.formInput} type="text" value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="/admission/apply" />
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", paddingTop: 22 }}>
                  <label className={styles.formCheckbox}>
                    <input type="checkbox" checked={form.isImportant}
                      onChange={(e) => setForm({ ...form, isImportant: e.target.checked })} />
                    গুরুত্বপূর্ণ
                  </label>
                  <label className={styles.formCheckbox}>
                    <input type="checkbox" checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                    প্রকাশিত
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button type="submit" disabled={saving} className={styles.primaryBtn}>
                {saving ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "তৈরি করুন"}
              </button>
              <button type="button" onClick={resetForm} className={styles.secondaryBtn}>বাতিল</button>
            </div>
          </form>
        </div>
      )}

      {/* Notices Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>শিরোনাম</th>
              <th className={styles.th}>ক্যাটাগরি</th>
              <th className={styles.thCenter}>স্ট্যাটাস</th>
              <th className={styles.thRight}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.tdName}>{notice.title}</div>
                  <div className={styles.tdMeta}>
                    {new Date(notice.publishedAt).toLocaleDateString("bn-BD")}
                    {notice.isImportant && (
                      <span className={`${styles.badge} ${styles.badgeDanger}`} style={{ marginLeft: 8 }}>
                        গুরুত্বপূর্ণ
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badgeLg} ${styles.badgeSuccess}`}>
                    {typeLabels[notice.type]}
                  </span>
                </td>
                <td className={styles.tdCenter}>
                  <button
                    className={`${styles.statusToggle} ${notice.isPublished ? styles.statusActive : styles.statusInactive}`}
                    onClick={() => handleTogglePublish(notice.id, notice.isPublished)}
                  >
                    {notice.isPublished ? "প্রকাশিত" : "ড্রাফট"}
                  </button>
                </td>
                <td className={styles.tdRight}>
                  <button className={styles.actionBtn} style={{ marginRight: 8 }} onClick={() => startEdit(notice)}>
                    সম্পাদনা
                  </button>
                  <button className={styles.dangerBtn} onClick={() => handleDelete(notice.id)}>
                    মুছুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notices.length === 0 && (
          <div className={styles.emptyState}>
            কোনো নোটিশ নেই। উপরে &quot;নতুন নোটিশ&quot; বাটনে ক্লিক করুন।
          </div>
        )}
      </div>
    </div>
  );
}
