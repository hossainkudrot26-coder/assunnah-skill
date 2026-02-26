"use client";

import { useEffect, useState } from "react";
import {
  getAdminNotices, createNotice, updateNotice, deleteNotice, toggleNoticePublish,
} from "@/lib/actions/notice";
import styles from "../admin-dashboard.module.css";

type NoticeType = "ADMISSION" | "EXAM" | "RESULT" | "EVENT" | "GENERAL";

const typeLabels: Record<NoticeType, string> = {
  ADMISSION: "ভর্তি",
  EXAM: "পরীক্ষা",
  RESULT: "ফলাফল",
  EVENT: "ইভেন্ট",
  GENERAL: "সাধারণ",
};

const emptyForm = {
  title: "",
  description: "",
  type: "GENERAL" as NoticeType,
  isImportant: false,
  isPublished: true,
  link: "",
};

export default function AdminNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const data = await getAdminNotices();
    setNotices(data);
    setLoading(false);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(notice: any) {
    setForm({
      title: notice.title,
      description: notice.description,
      type: notice.type,
      isImportant: notice.isImportant,
      isPublished: notice.isPublished,
      link: notice.link || "",
    });
    setEditingId(notice.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError("শিরোনাম ও বিবরণ আবশ্যক");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      isImportant: form.isImportant,
      isPublished: form.isPublished,
      link: form.link || undefined,
    };

    const result = editingId
      ? await updateNotice(editingId, payload)
      : await createNotice(payload);

    if (result.success) {
      setSuccess(editingId ? "নোটিশ আপডেট হয়েছে!" : "নোটিশ তৈরি হয়েছে!");
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "সমস্যা হয়েছে");
    }
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
        <div style={{ padding: "60px", textAlign: "center", color: "var(--color-neutral-400)" }}>লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>নোটিশ ব্যবস্থাপনা</h1>
          <p style={{ color: "var(--color-neutral-500)", fontSize: 14, marginTop: 4 }}>মোট {notices.length}টি নোটিশ</p>
        </div>
        <button
          className={styles.primaryBtn}
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ padding: "10px 20px", borderRadius: 8, background: "var(--color-primary-500)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
        >
          + নতুন নোটিশ
        </button>
      </div>

      {success && (
        <div style={{ padding: "12px 16px", background: "#ECFDF5", borderRadius: 8, color: "#065F46", marginBottom: 16, fontSize: 14 }}>
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: "var(--color-bg-card, white)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{editingId ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ"}</h2>

          {error && <div style={{ padding: "10px 14px", background: "#FEF2F2", borderRadius: 8, color: "#991B1B", marginBottom: 12, fontSize: 13 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--color-neutral-700)" }}>শিরোনাম *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="নোটিশের শিরোনাম"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border, #d1d5db)", fontSize: 14, background: "var(--color-bg, white)", color: "var(--color-text, #1f2937)" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--color-neutral-700)" }}>বিবরণ *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="নোটিশের বিবরণ"
                  rows={4}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border, #d1d5db)", fontSize: 14, resize: "vertical", background: "var(--color-bg, white)", color: "var(--color-text, #1f2937)" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--color-neutral-700)" }}>ক্যাটাগরি</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as NoticeType })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border, #d1d5db)", fontSize: 14, background: "var(--color-bg, white)", color: "var(--color-text, #1f2937)" }}
                  >
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--color-neutral-700)" }}>লিংক (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="/admission/apply"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border, #d1d5db)", fontSize: 14, background: "var(--color-bg, white)", color: "var(--color-text, #1f2937)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 16, alignItems: "center", paddingTop: 22 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "var(--color-neutral-700)" }}>
                    <input type="checkbox" checked={form.isImportant} onChange={(e) => setForm({ ...form, isImportant: e.target.checked })} />
                    গুরুত্বপূর্ণ
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "var(--color-neutral-700)" }}>
                    <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                    প্রকাশিত
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: "10px 24px", borderRadius: 8, background: "var(--color-primary-500)", color: "white", border: "none", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "তৈরি করুন"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: "10px 24px", borderRadius: 8, background: "var(--color-neutral-100)", color: "var(--color-neutral-700)", border: "1px solid var(--color-border, #d1d5db)", fontWeight: 500, cursor: "pointer" }}
              >
                বাতিল
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices Table */}
      <div style={{ background: "var(--color-bg-card, white)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border, #e5e7eb)", background: "var(--color-neutral-50, #f9fafb)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-neutral-600)" }}>শিরোনাম</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-neutral-600)" }}>ক্যাটাগরি</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "var(--color-neutral-600)" }}>স্ট্যাটাস</th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--color-neutral-600)" }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id} style={{ borderBottom: "1px solid var(--color-border, #f3f4f6)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600, color: "var(--color-neutral-900)" }}>{notice.title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-neutral-500)", marginTop: 2 }}>
                    {new Date(notice.publishedAt).toLocaleDateString("bn-BD")}
                    {notice.isImportant && <span style={{ marginLeft: 8, color: "#C62828", fontWeight: 600 }}>গুরুত্বপূর্ণ</span>}
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "var(--color-primary-50, #ECFDF5)", color: "var(--color-primary-700, #065F46)" }}>
                    {typeLabels[notice.type as NoticeType]}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button
                    onClick={() => handleTogglePublish(notice.id, notice.isPublished)}
                    style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: notice.isPublished ? "#ECFDF5" : "#FEF2F2", color: notice.isPublished ? "#065F46" : "#991B1B" }}
                  >
                    {notice.isPublished ? "প্রকাশিত" : "ড্রাফট"}
                  </button>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button
                    onClick={() => startEdit(notice)}
                    style={{ padding: "6px 12px", borderRadius: 6, fontSize: 13, border: "1px solid var(--color-border, #d1d5db)", background: "transparent", cursor: "pointer", marginRight: 8, color: "var(--color-neutral-700)" }}
                  >
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    style={{ padding: "6px 12px", borderRadius: 6, fontSize: 13, border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#991B1B", cursor: "pointer" }}
                  >
                    মুছুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {notices.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-neutral-400)" }}>
            কোনো নোটিশ নেই। উপরে "নতুন নোটিশ" বাটনে ক্লিক করুন।
          </div>
        )}
      </div>
    </div>
  );
}
