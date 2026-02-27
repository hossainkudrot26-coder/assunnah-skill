"use client";

import styles from "./courses.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

export interface SyllabusModule {
    title: string;
    topics: string[];
}

export interface InstructorData {
    name: string;
    role: string;
    bio: string;
    initials: string;
}

export interface CourseFormData {
    id?: string;
    title: string;
    titleEn: string;
    slug: string;
    shortDesc: string;
    fullDesc: string;
    duration: string;
    type: string;
    category: string;
    iconName: string;
    color: string;
    batchInfo: string;
    status: "DRAFT" | "PUBLISHED";
    isFeatured: boolean;
    sortOrder: number;
    feeAdmission: string;
    feeTotal: string;
    feeScholarship: string;
    highlights: string;
    syllabus: SyllabusModule[];
    instructors: InstructorData[];
}

export const emptyForm: CourseFormData = {
    title: "",
    titleEn: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    duration: "",
    type: "",
    category: "",
    iconName: "BookIcon",
    color: "#1B8A50",
    batchInfo: "",
    status: "DRAFT",
    isFeatured: false,
    sortOrder: 0,
    feeAdmission: "",
    feeTotal: "",
    feeScholarship: "",
    highlights: "",
    syllabus: [],
    instructors: [],
};

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const iconOptions = [
    { value: "BookIcon", label: "📚 বই" },
    { value: "BriefcaseIcon", label: "💼 ব্রিফকেস" },
    { value: "ChefHatIcon", label: "👨‍🍳 শেফ" },
    { value: "ChartIcon", label: "📊 চার্ট" },
    { value: "ScissorsIcon", label: "✂️ কাঁচি" },
    { value: "CodeIcon", label: "💻 কোড" },
    { value: "CarIcon", label: "🚗 গাড়ি" },
    { value: "TargetIcon", label: "🎯 টার্গেট" },
];

const typeOptions = ["আবাসিক", "ফ্রি", "নারীদের জন্য", "রেসিডেন্সিয়াল", "সম্পূর্ণ আবাসিক"];
const categoryOptions = ["শুধুমাত্র পুরুষ", "শুধুমাত্র নারী", "সবার জন্য"];

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

export function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

function generateInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

interface CourseFormModalProps {
    form: CourseFormData;
    setForm: React.Dispatch<React.SetStateAction<CourseFormData>>;
    error: string;
    saving: boolean;
    onSave: () => void;
    onClose: () => void;
}

export default function CourseFormModal({
    form,
    setForm,
    error,
    saving,
    onSave,
    onClose,
}: CourseFormModalProps) {
    // Instructor management
    const addInstructor = () => {
        setForm((prev) => ({
            ...prev,
            instructors: [...prev.instructors, { name: "", role: "", bio: "", initials: "" }],
        }));
    };

    const removeInstructor = (index: number) => {
        setForm((prev) => ({
            ...prev,
            instructors: prev.instructors.filter((_, i) => i !== index),
        }));
    };

    const updateInstructor = (index: number, field: keyof InstructorData, value: string) => {
        setForm((prev) => ({
            ...prev,
            instructors: prev.instructors.map((inst, i) =>
                i === index ? { ...inst, [field]: value } : inst
            ),
        }));
    };

    // Syllabus management
    const addSyllabus = () => {
        setForm((prev) => ({
            ...prev,
            syllabus: [...prev.syllabus, { title: "", topics: [] }],
        }));
    };

    const removeSyllabus = (index: number) => {
        setForm((prev) => ({
            ...prev,
            syllabus: prev.syllabus.filter((_, i) => i !== index),
        }));
    };

    const updateSyllabusTitle = (index: number, title: string) => {
        setForm((prev) => ({
            ...prev,
            syllabus: prev.syllabus.map((s, i) => (i === index ? { ...s, title } : s)),
        }));
    };

    const updateSyllabusTopics = (index: number, topicsStr: string) => {
        setForm((prev) => ({
            ...prev,
            syllabus: prev.syllabus.map((s, i) =>
                i === index ? { ...s, topics: topicsStr.split(",").map((t) => t.trim()).filter(Boolean) } : s
            ),
        }));
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{form.id ? "কোর্স সম্পাদনা" : "নতুন কোর্স তৈরি"}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.modalBody}>
                    {/* Basic Info */}
                    <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.formFull}`}>
                            <label>কোর্সের নাম (বাংলা) *</label>
                            <input
                                value={form.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    setForm((prev) => ({
                                        ...prev,
                                        title,
                                        slug: prev.id ? prev.slug : generateSlug(title),
                                    }));
                                }}
                                placeholder="স্মল বিজনেস ম্যানেজমেন্ট"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>কোর্সের নাম (ইংরেজি)</label>
                            <input
                                value={form.titleEn}
                                onChange={(e) => setForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                                placeholder="Small Business Management"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Slug *</label>
                            <input
                                value={form.slug}
                                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                                placeholder="small-business-management"
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formFull}`}>
                            <label>সংক্ষিপ্ত বিবরণ *</label>
                            <textarea
                                value={form.shortDesc}
                                onChange={(e) => setForm((prev) => ({ ...prev, shortDesc: e.target.value }))}
                                placeholder="কোর্সের সংক্ষিপ্ত বিবরণ..."
                                rows={2}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formFull}`}>
                            <label>বিস্তারিত বিবরণ *</label>
                            <textarea
                                value={form.fullDesc}
                                onChange={(e) => setForm((prev) => ({ ...prev, fullDesc: e.target.value }))}
                                placeholder="কোর্সের বিস্তারিত বিবরণ..."
                                rows={4}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>সময়কাল *</label>
                            <input
                                value={form.duration}
                                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                                placeholder="৩ মাস"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>ধরন *</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                            >
                                <option value="">নির্বাচন করুন</option>
                                {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>ক্যাটাগরি</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                            >
                                <option value="">নির্বাচন করুন</option>
                                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>আইকন</label>
                            <select
                                value={form.iconName}
                                onChange={(e) => setForm((prev) => ({ ...prev, iconName: e.target.value }))}
                            >
                                {iconOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>রঙ</label>
                            <div className={styles.colorInput}>
                                <input
                                    type="color"
                                    value={form.color}
                                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                                />
                                <input
                                    type="text"
                                    value={form.color}
                                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                                    placeholder="#1B8A50"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>ক্রম</label>
                            <input
                                type="number"
                                value={form.sortOrder}
                                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>স্ট্যাটাস</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "DRAFT" | "PUBLISHED" }))}
                            >
                                <option value="DRAFT">ড্রাফট</option>
                                <option value="PUBLISHED">প্রকাশিত</option>
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                            <input
                                type="checkbox"
                                id="featured"
                                checked={form.isFeatured}
                                onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                            />
                            <label htmlFor="featured">ফিচার্ড কোর্স</label>
                        </div>

                        <div className={`${styles.formGroup} ${styles.formFull}`}>
                            <label>ব্যাচ তথ্য</label>
                            <input
                                value={form.batchInfo}
                                onChange={(e) => setForm((prev) => ({ ...prev, batchInfo: e.target.value }))}
                                placeholder="প্রতি ৩ মাস পর পর নতুন ব্যাচ..."
                            />
                        </div>
                    </div>

                    {/* Fee Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formSectionTitle}>ফি তথ্য</div>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>ভর্তি ফি</label>
                                <input
                                    value={form.feeAdmission}
                                    onChange={(e) => setForm((prev) => ({ ...prev, feeAdmission: e.target.value }))}
                                    placeholder="বিনামূল্যে / ১০,০০০ টাকা"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>মোট ফি</label>
                                <input
                                    value={form.feeTotal}
                                    onChange={(e) => setForm((prev) => ({ ...prev, feeTotal: e.target.value }))}
                                    placeholder="৬০,০০০ টাকা"
                                />
                            </div>
                            <div className={`${styles.formGroup} ${styles.formFull}`}>
                                <label>স্কলারশিপ</label>
                                <input
                                    value={form.feeScholarship}
                                    onChange={(e) => setForm((prev) => ({ ...prev, feeScholarship: e.target.value }))}
                                    placeholder="১০০% পর্যন্ত স্কলারশিপ"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Highlights Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formSectionTitle}>হাইলাইটস</div>
                        <div className={`${styles.formGroup} ${styles.formFull}`}>
                            <label>প্রতি লাইনে একটি হাইলাইট লিখুন</label>
                            <textarea
                                value={form.highlights}
                                onChange={(e) => setForm((prev) => ({ ...prev, highlights: e.target.value }))}
                                placeholder={"NSDA স্বীকৃত\nজব প্লেসমেন্ট সুবিধা\n১০০% স্কলারশিপ"}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Instructors Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formSectionTitle}>ইন্সট্রাক্টর / শিক্ষক</div>
                        {form.instructors.map((inst, idx) => (
                            <div key={idx} className={styles.instructorItem}>
                                <div className={styles.instructorItemHeader}>
                                    <span className={styles.instructorItemLabel}>শিক্ষক #{idx + 1}</span>
                                    <button className={styles.removeInstructorBtn} onClick={() => removeInstructor(idx)}>✕</button>
                                </div>
                                <div className={styles.instructorGrid}>
                                    <div className={styles.formGroup}>
                                        <label>নাম *</label>
                                        <input
                                            value={inst.name}
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                updateInstructor(idx, "name", name);
                                                if (!inst.initials || inst.initials === generateInitials(inst.name)) {
                                                    updateInstructor(idx, "initials", generateInitials(name));
                                                }
                                            }}
                                            placeholder="শিক্ষকের নাম"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>পদবি *</label>
                                        <input
                                            value={inst.role}
                                            onChange={(e) => updateInstructor(idx, "role", e.target.value)}
                                            placeholder="প্রধান প্রশিক্ষক"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>সংক্ষিপ্ত নাম</label>
                                        <input
                                            value={inst.initials}
                                            onChange={(e) => updateInstructor(idx, "initials", e.target.value)}
                                            placeholder="AB"
                                            maxLength={4}
                                        />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.formFull}`}>
                                        <label>সংক্ষিপ্ত পরিচিতি</label>
                                        <textarea
                                            value={inst.bio}
                                            onChange={(e) => updateInstructor(idx, "bio", e.target.value)}
                                            placeholder="শিক্ষকের অভিজ্ঞতা ও যোগ্যতা..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className={styles.addInstructorBtn} onClick={addInstructor}>
                            + নতুন শিক্ষক যোগ করুন
                        </button>
                    </div>

                    {/* Syllabus Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formSectionTitle}>সিলেবাস</div>
                        {form.syllabus.map((mod, idx) => (
                            <div key={idx} className={styles.syllabusItem}>
                                <div className={styles.syllabusItemHeader}>
                                    <input
                                        value={mod.title}
                                        onChange={(e) => updateSyllabusTitle(idx, e.target.value)}
                                        placeholder="মডিউলের নাম"
                                    />
                                    <button className={styles.removeSyllabusBtn} onClick={() => removeSyllabus(idx)}>✕</button>
                                </div>
                                <input
                                    className={styles.topicsInput}
                                    value={mod.topics.join(", ")}
                                    onChange={(e) => updateSyllabusTopics(idx, e.target.value)}
                                    placeholder="টপিক ১, টপিক ২, টপিক ৩"
                                />
                                <div className={styles.topicsHint}>কমা দিয়ে পৃথক করুন</div>
                            </div>
                        ))}
                        <button className={styles.addSyllabusBtn} onClick={addSyllabus}>
                            + নতুন মডিউল যোগ করুন
                        </button>
                    </div>

                    {/* Error */}
                    {error && <div className={styles.errorMsg}>{error}</div>}

                    {/* Actions */}
                    <div className={styles.formActions}>
                        <button className={styles.cancelBtn} onClick={onClose}>বাতিল</button>
                        <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
                            {saving ? "সংরক্ষণ হচ্ছে..." : form.id ? "আপডেট করুন" : "তৈরি করুন"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
