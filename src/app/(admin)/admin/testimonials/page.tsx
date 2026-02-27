"use client";

import { useEffect, useState, useCallback } from "react";
import {
    getAdminTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialVisibility,
} from "@/lib/actions/testimonial";
import styles from "../admin-dashboard.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface TestimonialFormData {
    name: string;
    initials: string;
    batch: string;
    story: string;
    achievement: string;
    color: string;
    isVisible: boolean;
}

interface TestimonialItem {
    id: string;
    name: string;
    initials: string | null;
    batch: string;
    story: string;
    achievement: string;
    color: string;
    isVisible: boolean;
    sortOrder: number;
    createdAt: Date;
}

const emptyForm: TestimonialFormData = {
    name: "", initials: "", batch: "", story: "",
    achievement: "", color: "#1B8A50", isVisible: true,
};

const colorPresets = [
    { label: "সবুজ", value: "#1B8A50" },
    { label: "কমলা", value: "#E65100" },
    { label: "নীল", value: "#1565C0" },
    { label: "গোলাপি", value: "#AD1457" },
    { label: "বেগুনি", value: "#6A1B9A" },
    { label: "বাদামি", value: "#795548" },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<TestimonialFormData>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = useCallback(async () => {
        setLoading(true);
        const data = await getAdminTestimonials();
        setTestimonials(data as TestimonialItem[]);
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    function resetForm() {
        setForm(emptyForm); setEditingId(null); setShowForm(false); setError("");
    }

    function startEdit(t: TestimonialItem) {
        setForm({
            name: t.name, initials: t.initials || "", batch: t.batch,
            story: t.story, achievement: t.achievement, color: t.color, isVisible: t.isVisible,
        });
        setEditingId(t.id);
        setShowForm(true);
    }

    function autoInitials(name: string): string {
        return name.split(" ").map(w => w.charAt(0)).join("").slice(0, 2);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.batch || !form.story || !form.achievement) {
            setError("নাম, ব্যাচ, গল্প ও অর্জন আবশ্যক"); return;
        }
        setSaving(true); setError("");
        const payload = {
            name: form.name, initials: form.initials || autoInitials(form.name),
            batch: form.batch, story: form.story, achievement: form.achievement,
            color: form.color, isVisible: form.isVisible,
        };
        const result = editingId
            ? await updateTestimonial({ id: editingId, ...payload })
            : await createTestimonial(payload);
        if (result.success) {
            setSuccess(editingId ? "প্রশংসাপত্র আপডেট হয়েছে!" : "প্রশংসাপত্র তৈরি হয়েছে!");
            resetForm(); loadData();
            setTimeout(() => setSuccess(""), 3000);
        } else { setError(result.error || "সমস্যা হয়েছে"); }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("এই প্রশংসাপত্রটি মুছে ফেলতে চান?")) return;
        const result = await deleteTestimonial(id);
        if (result.success) loadData();
    }

    async function handleToggleVisibility(id: string, current: boolean) {
        await toggleTestimonialVisibility(id, !current);
        loadData();
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>প্রশংসাপত্র ব্যবস্থাপনা</h1>
                </div>
                <div className={styles.emptyState}>লোড হচ্ছে...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>প্রশংসাপত্র ব্যবস্থাপনা</h1>
                    <p className={styles.pageSubtitle}>মোট {testimonials.length}টি প্রশংসাপত্র</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => { resetForm(); setShowForm(true); }}>
                    + নতুন প্রশংসাপত্র
                </button>
            </div>

            {success && <div className={styles.alertSuccess}>{success}</div>}

            {/* Form */}
            {showForm && (
                <div className={styles.card}>
                    <h2 className={styles.formTitle}>
                        {editingId ? "প্রশংসাপত্র সম্পাদনা" : "নতুন প্রশংসাপত্র"}
                    </h2>
                    {error && <div className={styles.formError}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGrid}>
                            {/* Row 1: Name + Initials + Batch */}
                            <div className={styles.formRow213}>
                                <div>
                                    <label className={styles.formLabel}>নাম *</label>
                                    <input className={styles.formInput} type="text" value={form.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setForm(prev => ({ ...prev, name, initials: prev.initials || autoInitials(name) }));
                                        }}
                                        placeholder="শিক্ষার্থীর নাম" required />
                                </div>
                                <div>
                                    <label className={styles.formLabel}>ইনিশিয়াল</label>
                                    <input className={styles.formInput} type="text" value={form.initials}
                                        onChange={(e) => setForm({ ...form, initials: e.target.value })}
                                        placeholder="মর" maxLength={3} />
                                </div>
                                <div>
                                    <label className={styles.formLabel}>ব্যাচ *</label>
                                    <input className={styles.formInput} type="text" value={form.batch}
                                        onChange={(e) => setForm({ ...form, batch: e.target.value })}
                                        placeholder="ব্যাচ ১৪" required />
                                </div>
                            </div>

                            {/* Row 2: Story */}
                            <div>
                                <label className={styles.formLabel}>গল্প / অভিজ্ঞতা *</label>
                                <textarea className={styles.formTextarea} value={form.story}
                                    onChange={(e) => setForm({ ...form, story: e.target.value })}
                                    placeholder="শিক্ষার্থীর সাফল্যের গল্প..." rows={4} required />
                            </div>

                            {/* Row 3: Achievement + Color + Visibility */}
                            <div className={styles.formRow21a}>
                                <div>
                                    <label className={styles.formLabel}>অর্জন *</label>
                                    <input className={styles.formInput} type="text" value={form.achievement}
                                        onChange={(e) => setForm({ ...form, achievement: e.target.value })}
                                        placeholder="গ্রাফিক ডিজাইন স্টুডিও মালিক" required />
                                </div>
                                <div>
                                    <label className={styles.formLabel}>রঙ</label>
                                    <select className={styles.formSelect} value={form.color}
                                        onChange={(e) => setForm({ ...form, color: e.target.value })}>
                                        {colorPresets.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <label className={styles.formCheckbox} style={{ paddingBottom: 10 }}>
                                    <input type="checkbox" checked={form.isVisible}
                                        onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} />
                                    দৃশ্যমান
                                </label>
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

            {/* Testimonials Grid */}
            <div className={styles.cardGrid}>
                {testimonials.map((t) => (
                    <div key={t.id} className={t.isVisible ? styles.cardCompact : styles.cardFaded}>
                        <div className={styles.cardHeader}>
                            <div className={styles.avatar} style={{ background: `${t.color}15`, color: t.color }}>
                                {t.initials || t.name.slice(0, 2)}
                            </div>
                            <div className={styles.cardHeaderInfo}>
                                <div className={styles.cardHeaderName}>{t.name}</div>
                                <div className={styles.cardHeaderMeta}>{t.batch}</div>
                            </div>
                            {!t.isVisible && <span className={`${styles.badge} ${styles.badgeHidden}`}>লুকানো</span>}
                        </div>

                        <p className={styles.cardBio}>&quot;{t.story}&quot;</p>
                        <div className={styles.cardAchievement} style={{ color: t.color }}>🏆 {t.achievement}</div>

                        <div className={styles.btnRowSpread}>
                            <button className={styles.actionBtn} style={{ flex: 1 }} onClick={() => startEdit(t)}>সম্পাদনা</button>
                            <button className={styles.actionBtn} style={{ flex: 1 }} onClick={() => handleToggleVisibility(t.id, t.isVisible)}>
                                {t.isVisible ? "লুকান" : "দেখান"}
                            </button>
                            <button className={styles.dangerBtn} onClick={() => handleDelete(t.id)}>মুছুন</button>
                        </div>
                    </div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className={styles.emptyState}>
                    কোনো প্রশংসাপত্র নেই। উপরে &quot;নতুন প্রশংসাপত্র&quot; বাটনে ক্লিক করুন।
                </div>
            )}
        </div>
    );
}
