"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
  toggleCourseFeatured,
} from "@/lib/actions/course";
import styles from "./courses.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface SyllabusModule {
  title: string;
  topics: string[];
}

interface CourseFormData {
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
}

const emptyForm: CourseFormData = {
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
};

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

type FilterType = "ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED";

/* ═══════════════════════════════════════════
   ADMIN COURSES PAGE
   ═══════════════════════════════════════════ */

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CourseFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    const data = await getAdminCourses();
    setCourses(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Open edit modal with existing data
  const openEdit = (course: any) => {
    setForm({
      id: course.id,
      title: course.title,
      titleEn: course.titleEn || "",
      slug: course.slug,
      shortDesc: course.shortDesc,
      fullDesc: course.fullDesc,
      duration: course.duration,
      type: course.type,
      category: course.category || "",
      iconName: course.iconName || "BookIcon",
      color: course.color || "#1B8A50",
      batchInfo: course.batchInfo || "",
      status: course.status,
      isFeatured: course.isFeatured,
      sortOrder: course.sortOrder,
      feeAdmission: course.fee?.admission || "",
      feeTotal: course.fee?.total || "",
      feeScholarship: course.fee?.scholarship || "",
      highlights: course.highlights?.map((h: any) => h.text).join("\n") || "",
      syllabus: course.syllabus?.map((s: any) => ({
        title: s.title,
        topics: s.topics,
      })) || [],
    });
    setError("");
    setShowModal(true);
  };

  // Open create modal
  const openCreate = () => {
    setForm({ ...emptyForm, sortOrder: courses.length });
    setError("");
    setShowModal(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!form.title || !form.slug || !form.shortDesc || !form.fullDesc || !form.duration || !form.type) {
      setError("প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      titleEn: form.titleEn || undefined,
      slug: form.slug,
      shortDesc: form.shortDesc,
      fullDesc: form.fullDesc,
      duration: form.duration,
      type: form.type,
      category: form.category || undefined,
      iconName: form.iconName,
      color: form.color,
      batchInfo: form.batchInfo || undefined,
      status: form.status,
      isFeatured: form.isFeatured,
      sortOrder: form.sortOrder,
      fee: form.feeAdmission
        ? {
            admission: form.feeAdmission,
            total: form.feeTotal || undefined,
            scholarship: form.feeScholarship || undefined,
          }
        : undefined,
      highlights: form.highlights ? form.highlights.split("\n").filter(Boolean) : undefined,
      syllabus: form.syllabus.length > 0 ? form.syllabus : undefined,
    };

    let result;
    if (form.id) {
      result = await updateCourse({ id: form.id, ...payload });
    } else {
      result = await createCourse(payload);
    }

    if (result.success) {
      setShowModal(false);
      await loadCourses();
    } else {
      setError(result.error || "সমস্যা হয়েছে");
    }
    setSaving(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteCourse(deleteId);
    if (result.success) {
      setDeleteId(null);
      await loadCourses();
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await toggleCourseStatus(id, newStatus);
    await loadCourses();
  };

  // Handle toggle featured
  const handleToggleFeatured = async (id: string, current: boolean) => {
    await toggleCourseFeatured(id, !current);
    await loadCourses();
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

  // Filter
  const filtered = filter === "ALL" ? courses : courses.filter((c) => c.status === filter);

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.coursesPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>কোর্স ম্যানেজমেন্ট</h2>
          <span className={styles.count}>{courses.length} টি কোর্স</span>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          + নতুন কোর্স
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {(["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"] as FilterType[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "ALL" ? "সব" : f === "PUBLISHED" ? "প্রকাশিত" : f === "DRAFT" ? "ড্রাফট" : "আর্কাইভ"}
          </button>
        ))}
      </div>

      {/* Course List */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📚</div>
          <p className={styles.emptyText}>কোনো কোর্স পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className={styles.courseList}>
          {filtered.map((course: any) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseTop}>
                <div className={styles.courseInfo}>
                  <div className={styles.courseTitle}>{course.title}</div>
                  <div className={styles.courseMeta}>
                    <span>{course.duration}</span>
                    <span>|</span>
                    <span>{course.type}</span>
                    {course.category && (
                      <>
                        <span>|</span>
                        <span>{course.category}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${
                      course.status === "PUBLISHED"
                        ? styles.badgePublished
                        : course.status === "DRAFT"
                        ? styles.badgeDraft
                        : styles.badgeArchived
                    }`}
                  >
                    {course.status === "PUBLISHED" ? "প্রকাশিত" : course.status === "DRAFT" ? "ড্রাফট" : "আর্কাইভ"}
                  </span>
                  {course.isFeatured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>⭐ ফিচার্ড</span>}
                </div>
              </div>

              <p className={styles.courseDesc}>{course.shortDesc}</p>

              <div className={styles.courseBottom}>
                <div className={styles.courseStats}>
                  <span>📝 আবেদন: {course._count?.applications ?? 0}</span>
                  <span>🎓 শিক্ষার্থী: {course._count?.enrollments ?? 0}</span>
                </div>

                <div className={styles.courseActions}>
                  <button
                    className={`${styles.actionBtn} ${styles.statusBtn}`}
                    onClick={() => handleToggleStatus(course.id, course.status)}
                    title={course.status === "PUBLISHED" ? "ড্রাফট করুন" : "প্রকাশ করুন"}
                  >
                    {course.status === "PUBLISHED" ? "ড্রাফট" : "প্রকাশ"}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    onClick={() => openEdit(course)}
                  >
                    সম্পাদনা
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => setDeleteId(course.id)}
                  >
                    মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{form.id ? "কোর্স সম্পাদনা" : "নতুন কোর্স তৈরি"}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
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
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>বাতিল</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? "সংরক্ষণ হচ্ছে..." : form.id ? "আপডেট করুন" : "তৈরি করুন"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h4>কোর্স মুছতে চান?</h4>
            <p>এই কোর্সের সাথে সম্পর্কিত সব ডেটা (ফি, সিলেবাস, হাইলাইটস) মুছে যাবে।</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>বাতিল</button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>মুছে ফেলুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
