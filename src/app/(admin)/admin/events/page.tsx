"use client";

import { useEffect, useState } from "react";
import {
  getAdminEvents, createEvent, updateEvent, deleteEvent,
} from "@/lib/actions/event";
import styles from "../admin-dashboard.module.css";

type EventStatusType = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
type EventTypeType = "ADMISSION" | "SEMINAR" | "WORKSHOP" | "CEREMONY" | "EXAM";

const statusLabels: Record<EventStatusType, string> = { UPCOMING: "আসন্ন", ONGOING: "চলমান", COMPLETED: "সম্পন্ন", CANCELLED: "বাতিল" };
const typeLabels: Record<EventTypeType, string> = { ADMISSION: "ভর্তি", SEMINAR: "সেমিনার", WORKSHOP: "ওয়ার্কশপ", CEREMONY: "অনুষ্ঠান", EXAM: "পরীক্ষা" };
const statusColors: Record<EventStatusType, string> = { UPCOMING: "#1B8A50", ONGOING: "#1565C0", COMPLETED: "#78909C", CANCELLED: "#C62828" };

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  status: "UPCOMING" as EventStatusType,
  type: "CEREMONY" as EventTypeType,
  attendees: "",
  isPublished: true,
};

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
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
    const data = await getAdminEvents();
    setEvents(data);
    setLoading(false);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(event: any) {
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      status: event.status,
      type: event.type,
      attendees: event.attendees?.toString() || "",
      isPublished: event.isPublished,
    });
    setEditingId(event.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.time || !form.location) {
      setError("শিরোনাম, বিবরণ, তারিখ, সময় ও স্থান আবশ্যক");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      status: form.status,
      type: form.type,
      attendees: form.attendees ? parseInt(form.attendees) : undefined,
      isPublished: form.isPublished,
    };

    const result = editingId
      ? await updateEvent(editingId, payload)
      : await createEvent(payload);

    if (result.success) {
      setSuccess(editingId ? "ইভেন্ট আপডেট হয়েছে!" : "ইভেন্ট তৈরি হয়েছে!");
      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "সমস্যা হয়েছে");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("এই ইভেন্টটি মুছে ফেলতে চান?")) return;
    const result = await deleteEvent(id);
    if (result.success) loadData();
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}><h1 className={styles.pageTitle}>ইভেন্ট ব্যবস্থাপনা</h1></div>
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
          <h1 className={styles.pageTitle}>ইভেন্ট ব্যবস্থাপনা</h1>
          <p style={{ color: "var(--color-neutral-500)", fontSize: 14, marginTop: 4 }}>মোট {events.length}টি ইভেন্ট</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ padding: "10px 20px", borderRadius: 8, background: "var(--color-primary-500)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
        >
          + নতুন ইভেন্ট
        </button>
      </div>

      {success && (
        <div style={{ padding: "12px 16px", background: "#ECFDF5", borderRadius: 8, color: "#065F46", marginBottom: 16, fontSize: 14 }}>{success}</div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: "var(--color-bg-card, white)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{editingId ? "ইভেন্ট সম্পাদনা" : "নতুন ইভেন্ট"}</h2>
          {error && <div style={{ padding: "10px 14px", background: "#FEF2F2", borderRadius: 8, color: "#991B1B", marginBottom: 12, fontSize: 13 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>শিরোনাম *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="ইভেন্টের শিরোনাম" style={inputStyle} required />
              </div>

              <div>
                <label style={labelStyle}>বিবরণ *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="ইভেন্টের বিবরণ" rows={3} style={{ ...inputStyle, resize: "vertical" as const }} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>তারিখ *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>সময় *</label>
                  <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="সকাল ১০:০০ — বিকাল ৫:০০" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>স্থান *</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="আস-সুন্নাহ ক্যাম্পাস" style={inputStyle} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>ধরন</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventTypeType })} style={inputStyle}>
                    {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>স্ট্যাটাস</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatusType })} style={inputStyle}>
                    {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>অংশগ্রহণকারী</label>
                  <input type="number" value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })} placeholder="200" style={inputStyle} />
                </div>
                <div style={{ display: "flex", alignItems: "center", paddingTop: 22 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "var(--color-neutral-700)" }}>
                    <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                    প্রকাশিত
                  </label>
                </div>
              </div>
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

      {/* Events Table */}
      <div style={{ background: "var(--color-bg-card, white)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border, #e5e7eb)", background: "var(--color-neutral-50, #f9fafb)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-neutral-600)" }}>ইভেন্ট</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-neutral-600)" }}>তারিখ ও স্থান</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "var(--color-neutral-600)" }}>স্ট্যাটাস</th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--color-neutral-600)" }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} style={{ borderBottom: "1px solid var(--color-border, #f3f4f6)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600, color: "var(--color-neutral-900)" }}>{event.title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-neutral-500)", marginTop: 2 }}>
                    {typeLabels[event.type as EventTypeType]}
                    {event.attendees && <span style={{ marginLeft: 8 }}>{event.attendees} জন</span>}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--color-neutral-600)" }}>
                  <div>{new Date(event.date).toLocaleDateString("bn-BD")}</div>
                  <div style={{ fontSize: 12, color: "var(--color-neutral-400)", marginTop: 2 }}>{event.location}</div>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: `${statusColors[event.status as EventStatusType]}15`, color: statusColors[event.status as EventStatusType] }}>
                    {statusLabels[event.status as EventStatusType]}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button onClick={() => startEdit(event)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 13, border: "1px solid var(--color-border, #d1d5db)", background: "transparent", cursor: "pointer", marginRight: 8, color: "var(--color-neutral-700)" }}>
                    সম্পাদনা
                  </button>
                  <button onClick={() => handleDelete(event.id)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 13, border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#991B1B", cursor: "pointer" }}>
                    মুছুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-neutral-400)" }}>
            কোনো ইভেন্ট নেই। উপরে "নতুন ইভেন্ট" বাটনে ক্লিক করুন।
          </div>
        )}
      </div>
    </div>
  );
}
