"use client";

import { useEffect, useState, useCallback } from "react";
import {
    getAdminTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    toggleTeamMemberVisibility,
} from "@/lib/actions/team";
import styles from "../admin-dashboard.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface TeamMemberFormData {
    name: string;
    nameBn: string;
    role: string;
    bio: string;
    initials: string;
    email: string;
    phone: string;
    isVisible: boolean;
}

interface TeamMemberItem {
    id: string;
    name: string;
    nameBn: string | null;
    role: string;
    bio: string | null;
    image: string | null;
    initials: string | null;
    email: string | null;
    phone: string | null;
    sortOrder: number;
    isVisible: boolean;
}

const emptyForm: TeamMemberFormData = {
    name: "", nameBn: "", role: "", bio: "", initials: "",
    email: "", phone: "", isVisible: true,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AdminTeam() {
    const [members, setMembers] = useState<TeamMemberItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<TeamMemberFormData>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = useCallback(async () => {
        setLoading(true);
        const data = await getAdminTeamMembers();
        setMembers(data as TeamMemberItem[]);
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    function resetForm() {
        setForm(emptyForm); setEditingId(null); setShowForm(false); setError("");
    }

    function startEdit(m: TeamMemberItem) {
        setForm({
            name: m.name, nameBn: m.nameBn || "", role: m.role,
            bio: m.bio || "", initials: m.initials || "",
            email: m.email || "", phone: m.phone || "",
            isVisible: m.isVisible,
        });
        setEditingId(m.id);
        setShowForm(true);
    }

    function autoInitials(name: string): string {
        return name.split(" ").map(w => w.charAt(0)).join("").slice(0, 2);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.role) { setError("নাম ও পদবী আবশ্যক"); return; }

        setSaving(true); setError("");
        const payload = {
            name: form.name, nameBn: form.nameBn || undefined,
            role: form.role, bio: form.bio || undefined,
            initials: form.initials || autoInitials(form.name),
            email: form.email || undefined, phone: form.phone || undefined,
            isVisible: form.isVisible,
        };

        const result = editingId
            ? await updateTeamMember({ id: editingId, ...payload })
            : await createTeamMember(payload);

        if (result.success) {
            setSuccess(editingId ? "সদস্য আপডেট হয়েছে!" : "সদস্য যোগ হয়েছে!");
            resetForm(); loadData();
            setTimeout(() => setSuccess(""), 3000);
        } else { setError(result.error || "সমস্যা হয়েছে"); }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("এই সদস্যকে মুছে ফেলতে চান?")) return;
        const result = await deleteTeamMember(id);
        if (result.success) loadData();
    }

    async function handleToggleVisibility(id: string, current: boolean) {
        await toggleTeamMemberVisibility(id, !current);
        loadData();
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>টিম ব্যবস্থাপনা</h1>
                </div>
                <div className={styles.emptyState}>লোড হচ্ছে...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>টিম ব্যবস্থাপনা</h1>
                    <p className={styles.pageSubtitle}>মোট {members.length} জন সদস্য</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => { resetForm(); setShowForm(true); }}>
                    + নতুন সদস্য
                </button>
            </div>

            {success && <div className={styles.alertSuccess}>{success}</div>}

            {/* Form */}
            {showForm && (
                <div className={styles.card}>
                    <h2 className={styles.formTitle}>{editingId ? "সদস্য সম্পাদনা" : "নতুন সদস্য"}</h2>
                    {error && <div className={styles.formError}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGrid}>
                            {/* Row 1: Name EN + Name BN + Initials */}
                            <div className={styles.formRow321}>
                                <div>
                                    <label className={styles.formLabel}>নাম (ইংরেজি) *</label>
                                    <input className={styles.formInput} type="text" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Mir Mohammad Ali" required />
                                </div>
                                <div>
                                    <label className={styles.formLabel}>নাম (বাংলা)</label>
                                    <input className={styles.formInput} type="text" value={form.nameBn}
                                        onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                                        placeholder="মীর মোহাম্মদ আলী" />
                                </div>
                                <div>
                                    <label className={styles.formLabel}>ইনিশিয়াল</label>
                                    <input className={styles.formInput} type="text" value={form.initials}
                                        onChange={(e) => setForm({ ...form, initials: e.target.value })}
                                        placeholder="MA" maxLength={3} />
                                </div>
                            </div>

                            {/* Row 2: Role + Email + Phone */}
                            <div className={styles.formRow3}>
                                <div>
                                    <label className={styles.formLabel}>পদবী *</label>
                                    <input className={styles.formInput} type="text" value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        placeholder="প্রতিষ্ঠাতা" required />
                                </div>
                                <div>
                                    <label className={styles.formLabel}>ইমেইল</label>
                                    <input className={styles.formInput} type="email" value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className={styles.formLabel}>ফোন</label>
                                    <input className={styles.formInput} type="text" value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="01XXXXXXXXX" />
                                </div>
                            </div>

                            {/* Row 3: Bio */}
                            <div>
                                <label className={styles.formLabel}>সংক্ষিপ্ত পরিচয়</label>
                                <textarea className={styles.formTextarea} value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    placeholder="সদস্যের সংক্ষিপ্ত পরিচয়..." rows={3} />
                            </div>

                            <label className={styles.formCheckbox}>
                                <input type="checkbox" checked={form.isVisible}
                                    onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} />
                                ওয়েবসাইটে দৃশ্যমান
                            </label>
                        </div>

                        <div className={styles.btnRow}>
                            <button type="submit" disabled={saving} className={styles.primaryBtn}>
                                {saving ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "যোগ করুন"}
                            </button>
                            <button type="button" onClick={resetForm} className={styles.secondaryBtn}>বাতিল</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Team Grid */}
            <div className={styles.cardGridNarrow}>
                {members.map((m) => (
                    <div key={m.id} className={m.isVisible ? styles.cardCompact : styles.cardFaded}>
                        <div className={styles.cardHeader}>
                            <div className={styles.avatarLg} style={{ background: "#1B8A5015", color: "#1B8A50" }}>
                                {m.initials || m.name.slice(0, 2)}
                            </div>
                            <div className={styles.cardHeaderInfo}>
                                <div className={styles.cardHeaderName}>{m.name}</div>
                                <div className={styles.cardHeaderRole}>{m.role}</div>
                            </div>
                            {!m.isVisible && <span className={`${styles.badge} ${styles.badgeHidden}`}>লুকানো</span>}
                        </div>

                        {m.bio && <p className={styles.cardBio}>{m.bio}</p>}

                        <div className={styles.btnRowSpread}>
                            <button className={styles.actionBtn} style={{ flex: 1 }} onClick={() => startEdit(m)}>সম্পাদনা</button>
                            <button className={styles.actionBtn} style={{ flex: 1 }} onClick={() => handleToggleVisibility(m.id, m.isVisible)}>
                                {m.isVisible ? "লুকান" : "দেখান"}
                            </button>
                            <button className={styles.dangerBtn} onClick={() => handleDelete(m.id)}>মুছুন</button>
                        </div>
                    </div>
                ))}
            </div>

            {members.length === 0 && (
                <div className={styles.emptyState}>
                    কোনো টিম সদস্য নেই। উপরে &quot;নতুন সদস্য&quot; বাটনে ক্লিক করুন।
                </div>
            )}
        </div>
    );
}
