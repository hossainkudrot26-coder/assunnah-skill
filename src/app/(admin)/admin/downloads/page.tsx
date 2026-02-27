"use client";

import { useEffect, useState } from "react";
import type { Download } from "@prisma/client";
import {
  getAdminDownloads, createDownload, updateDownload, deleteDownload,
} from "@/lib/actions/download";
import styles from "../admin-dashboard.module.css";

const categoryLabels: Record<string, string> = { GENERAL: "সাধারণ", ADMISSION: "ভর্তি", SYLLABUS: "সিলেবাস" };

const emptyForm = {
  title: "",
  description: "",
  fileUrl: "",
  fileType: "PDF",
  fileSize: "",
  category: "GENERAL" as "GENERAL" | "ADMISSION" | "SYLLABUS",
  iconColor: "#1B8A50",
  isPublished: true,
};

export default function AdminDownloads() {
  const [items, setItems] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const data = await getAdminDownloads();
    setItems(data);
    setLoading(false);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(item: Download) {
    setForm({
      title: item.title,
      description: item.description,
      fileUrl: item.fileUrl || "",
      fileType: item.fileType || "PDF",
      fileSize: item.fileSize || "",
      category: item.category,
      iconColor: item.iconColor || "#1B8A50",
      isPublished: item.isPublished,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setForm((f) => ({ ...f, fileUrl: data.url, fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB` }));
      } else {
        setError(data.error || "আপলোড ব্যর্থ");
      }
    } catch {
      setError("আপলোড করতে সমস্যা হয়েছে");
    }
    setUploading(false);
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
      fileUrl: form.fileUrl || undefined,
      fileType: form.fileType,
      fileSize: form.fileSize || undefined,
      category: form.category,
      iconColor: form.iconColor,
      isPublished: form.isPublished,
    };

    const result = editingId
      ? await updateDownload(editingId, payload)
      : await createDownload(payload);

    if (result.success) {
      setSuccess(editingId ? "আপডেট হয়েছে!" : "তৈরি হয়েছে!");
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "সমস্যা হয়েছে");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("এই আইটেমটি মুছে ফেলতে চান?")) return;
    const result = await deleteDownload(id);
    if (result.success) loadData();
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}><h1 className={styles.pageTitle}>ডাউনলোড ব্যবস্থাপনা</h1></div>
        <div style={{ padding: "60px", textAlign: "center", color: "var(--color-neutral-400)" }}>লোড হচ্ছে...</div>
      </div>
    );
  }

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border, #d1d5db)", fontSize: 14, background: "var(--color-bg, white)", color: "var(--color-text, #1f2937)" } as const;
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--color-neutral-700)" } as const;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>ডাউনলোড ব্যবস্থাপনা</h1>
          <p style={{ color: "var(--color-neutral-500)", fontSize: 14, marginTop: 4 }}>
            মোট {items.length}টি আইটেম • {items.filter(i => i.fileUrl).length}টি ফাইল আপলোড হয়েছে
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ padding: "10px 20px", borderRadius: 8, background: "var(--color-primary-500)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
        >
          + নতুন আইটেম
        </button>
      </div>

      {success && (
        <div style={{ padding: "12px 16px", background: "var(--color-success-bg, #ECFDF5)", borderRadius: 8, color: "var(--color-success-text, #065F46)", border: "1px solid var(--color-success-border, transparent)", marginBottom: 16, fontSize: 14 }}>{success}</div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: "var(--color-bg-card, white)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{editingId ? "আইটেম সম্পাদনা" : "নতুন ডাউনলোড আইটেম"}</h2>
          {error && <div style={{ padding: "10px 14px", background: "var(--color-error-bg, #FEF2F2)", borderRadius: 8, color: "var(--color-error-text, #991B1B)", border: "1px solid var(--color-error-border, transparent)", marginBottom: 12, fontSize: 13 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>শিরোনাম *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="ডকুমেন্টের শিরোনাম" style={inputStyle} required />
              </div>

              <div>
                <label style={labelStyle}>বিবরণ *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="সংক্ষিপ্ত বিবরণ" rows={2} style={{ ...inputStyle, resize: "vertical" as const }} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>ক্যাটাগরি</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as "GENERAL" | "ADMISSION" | "SYLLABUS" })} style={inputStyle}>
                    {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>ফাইল টাইপ</label>
                  <input type="text" value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} placeholder="PDF" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>আইকন রং</label>
                  <input type="color" value={form.iconColor} onChange={(e) => setForm({ ...form, iconColor: e.target.value })} style={{ ...inputStyle, height: 42, padding: 4 }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>ফাইল আপলোড / URL</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="ফাইল URL বা আপলোড করুন" style={{ ...inputStyle, flex: 1 }} />
                  <label style={{ padding: "10px 16px", borderRadius: 8, background: "var(--color-neutral-100)", border: "1px solid var(--color-border, #d1d5db)", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, color: "var(--color-neutral-700)", whiteSpace: "nowrap" as const }}>
                    {uploading ? "আপলোড হচ্ছে..." : "ফাইল বাছুন"}
                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png,.webp" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>
                </div>
                {form.fileSize && <p style={{ fontSize: 12, color: "var(--color-neutral-500)", marginTop: 4 }}>সাইজ: {form.fileSize}</p>}
                {!form.fileUrl && <p style={{ fontSize: 12, color: "var(--color-accent-500, #F57C00)", marginTop: 4 }}>ফাইল না দিলে "শীঘ্রই আসছে" দেখাবে</p>}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "var(--color-neutral-700)" }}>
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                প্রকাশিত
              </label>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, background: "var(--color-primary-500)", color: "white", border: "none", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "তৈরি করুন"}
              </button>
              <button type="button" onClick={resetForm} style={{ padding: "10px 24px", borderRadius: 8, background: "var(--color-neutral-100)", color: "var(--color-neutral-700)", border: "1px solid var(--color-border, #d1d5db)", fontWeight: 500, cursor: "pointer" }}>
                বাতিল
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "var(--color-bg-card, white)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border, #e5e7eb)", background: "var(--color-neutral-50, #f9fafb)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-neutral-600)" }}>আইটেম</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "var(--color-neutral-600)" }}>ক্যাটাগরি</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "var(--color-neutral-600)" }}>ফাইল</th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--color-neutral-600)" }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border, #f3f4f6)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600, color: "var(--color-neutral-900)" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-neutral-500)", marginTop: 2 }}>{item.description.slice(0, 60)}...</div>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "var(--color-primary-50, #ECFDF5)", color: "var(--color-primary-700, #065F46)" }}>
                    {categoryLabels[item.category] || item.category}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  {item.fileUrl ? (
                    <span style={{ color: "#065F46", fontSize: 12, fontWeight: 600 }}>✓ আপলোড হয়েছে</span>
                  ) : (
                    <span style={{ color: "#F57C00", fontSize: 12, fontWeight: 600 }}>অপেক্ষমাণ</span>
                  )}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button onClick={() => startEdit(item)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 13, border: "1px solid var(--color-border, #d1d5db)", background: "transparent", cursor: "pointer", marginRight: 8, color: "var(--color-neutral-700)" }}>
                    সম্পাদনা
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 13, border: "1px solid var(--color-error-border, #FCA5A5)", background: "var(--color-error-bg, #FEF2F2)", color: "var(--color-error-text, #991B1B)", cursor: "pointer" }}>
                    মুছুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-neutral-400)" }}>
            কোনো ডাউনলোড আইটেম নেই। উপরে "নতুন আইটেম" বাটনে ক্লিক করুন।
          </div>
        )}
      </div>
    </div>
  );
}
