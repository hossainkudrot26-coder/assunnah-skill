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
import {
  getAdminBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  toggleBatchStatus,
} from "@/lib/actions/batch";
import styles from "./courses.module.css";
import CourseFormModal, {
  type CourseFormData,
  emptyForm,
  generateSlug,
} from "./CourseFormModal";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface BatchFormData {
  id?: string;
  courseId: string;
  batchNumber: number;
  startDate: string;
  endDate: string;
  capacity: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
}

// Typed course from Prisma (replaces any[])
interface CourseRecord {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  type: string;
  category: string | null;
  iconName: string | null;
  color: string | null;
  batchInfo: string | null;
  status: string;
  isFeatured: boolean;
  sortOrder: number;
  fee: { admission: string; total: string | null; scholarship: string | null } | null;
  highlights: { id: string; text: string }[];
  syllabus: { id: string; title: string; topics: string[] }[];
  instructors: { id: string; name: string; role: string; bio: string; initials: string }[];
  _count: { applications: number; enrollments: number };
}

interface BatchRecord {
  id: string;
  courseId: string;
  batchNumber: number;
  startDate: string | null;
  endDate: string | null;
  capacity: number;
  status: string;
  _count: { enrollments: number };
}

const emptyBatchForm: BatchFormData = {
  courseId: "",
  batchNumber: 1,
  startDate: "",
  endDate: "",
  capacity: 30,
  status: "UPCOMING",
};

type FilterType = "ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED";

/* ═══════════════════════════════════════════
   ADMIN COURSES PAGE
   ═══════════════════════════════════════════ */

export default function AdminCourses() {
  // Course states
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CourseFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Batch states
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [expandedBatches, setExpandedBatches] = useState<string | null>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState<BatchFormData>(emptyBatchForm);
  const [batchSaving, setBatchSaving] = useState(false);
  const [batchError, setBatchError] = useState("");
  const [deleteBatchId, setDeleteBatchId] = useState<string | null>(null);

  /* ─── Data Loading ─── */

  const loadCourses = useCallback(async () => {
    const data = await getAdminCourses();
    setCourses(data as unknown as CourseRecord[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  const loadBatches = useCallback(async (courseId: string) => {
    const data = await getAdminBatches(courseId);
    setBatches(data as unknown as BatchRecord[]);
  }, []);

  /* ─── Course Handlers ─── */

  const toggleBatchSection = async (courseId: string) => {
    if (expandedBatches === courseId) {
      setExpandedBatches(null);
      setBatches([]);
    } else {
      setExpandedBatches(courseId);
      await loadBatches(courseId);
    }
  };

  const openEdit = (course: CourseRecord) => {
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
      status: course.status as "DRAFT" | "PUBLISHED",
      isFeatured: course.isFeatured,
      sortOrder: course.sortOrder,
      feeAdmission: course.fee?.admission || "",
      feeTotal: course.fee?.total || "",
      feeScholarship: course.fee?.scholarship || "",
      highlights: course.highlights?.map((h) => h.text).join("\n") || "",
      syllabus: course.syllabus?.map((s) => ({
        title: s.title,
        topics: s.topics,
      })) || [],
      instructors: course.instructors?.map((inst) => ({
        name: inst.name,
        role: inst.role,
        bio: inst.bio,
        initials: inst.initials,
      })) || [],
    });
    setError("");
    setShowModal(true);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, sortOrder: courses.length });
    setError("");
    setShowModal(true);
  };

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
      instructors: form.instructors.filter((inst) => inst.name.trim()).length > 0
        ? form.instructors.filter((inst) => inst.name.trim())
        : undefined,
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

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteCourse(deleteId);
    if (result.success) {
      setDeleteId(null);
      await loadCourses();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await toggleCourseStatus(id, newStatus);
    await loadCourses();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await toggleCourseFeatured(id, !current);
    await loadCourses();
  };

  /* ─── Batch Handlers ─── */

  const openBatchCreate = (courseId: string) => {
    const courseBatches = batches.filter((b) => b.courseId === courseId);
    const nextNumber = courseBatches.length > 0
      ? Math.max(...courseBatches.map((b) => b.batchNumber)) + 1
      : 1;
    setBatchForm({ ...emptyBatchForm, courseId, batchNumber: nextNumber });
    setBatchError("");
    setShowBatchModal(true);
  };

  const openBatchEdit = (batch: BatchRecord) => {
    setBatchForm({
      id: batch.id,
      courseId: batch.courseId,
      batchNumber: batch.batchNumber,
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split("T")[0] : "",
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().split("T")[0] : "",
      capacity: batch.capacity,
      status: batch.status as "UPCOMING" | "ONGOING" | "COMPLETED",
    });
    setBatchError("");
    setShowBatchModal(true);
  };

  const handleBatchSave = async () => {
    if (!batchForm.courseId || !batchForm.batchNumber) {
      setBatchError("প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন");
      return;
    }

    setBatchSaving(true);
    setBatchError("");

    let result;
    if (batchForm.id) {
      result = await updateBatch({
        id: batchForm.id,
        batchNumber: batchForm.batchNumber,
        startDate: batchForm.startDate || undefined,
        endDate: batchForm.endDate || undefined,
        capacity: batchForm.capacity,
        status: batchForm.status,
      });
    } else {
      result = await createBatch({
        courseId: batchForm.courseId,
        batchNumber: batchForm.batchNumber,
        startDate: batchForm.startDate || undefined,
        endDate: batchForm.endDate || undefined,
        capacity: batchForm.capacity,
        status: batchForm.status,
      });
    }

    if (result.success) {
      setShowBatchModal(false);
      await loadBatches(batchForm.courseId);
    } else {
      setBatchError(result.error || "সমস্যা হয়েছে");
    }
    setBatchSaving(false);
  };

  const handleBatchDelete = async () => {
    if (!deleteBatchId) return;
    const result = await deleteBatch(deleteBatchId);
    if (result.success) {
      setDeleteBatchId(null);
      if (expandedBatches) await loadBatches(expandedBatches);
    }
  };

  const handleBatchStatusToggle = async (batchId: string, newStatus: "UPCOMING" | "ONGOING" | "COMPLETED") => {
    await toggleBatchStatus(batchId, newStatus);
    if (expandedBatches) await loadBatches(expandedBatches);
  };

  /* ─── Filter ─── */

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
          {filtered.map((course) => (
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
                    className={`${styles.badge} ${course.status === "PUBLISHED"
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

              {/* Instructor badges */}
              {course.instructors && course.instructors.length > 0 && (
                <div className={styles.instructorBadges}>
                  {course.instructors.map((inst) => (
                    <span key={inst.id} className={styles.instructorBadge}>
                      <span className={styles.instructorInitials}>{inst.initials}</span>
                      {inst.name}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.courseBottom}>
                <div className={styles.courseStats}>
                  <span>📝 আবেদন: {course._count?.applications ?? 0}</span>
                  <span>🎓 শিক্ষার্থী: {course._count?.enrollments ?? 0}</span>
                </div>

                <div className={styles.courseActions}>
                  <button
                    className={`${styles.actionBtn} ${styles.batchBtn}`}
                    onClick={() => toggleBatchSection(course.id)}
                    title="ব্যাচ ম্যানেজমেন্ট"
                  >
                    📋 ব্যাচ
                  </button>
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

              {/* Batch Section (expandable) */}
              {expandedBatches === course.id && (
                <div className={styles.batchSection}>
                  <div className={styles.batchSectionHeader}>
                    <h4>ব্যাচ তালিকা</h4>
                    <button className={styles.addBatchBtn} onClick={() => openBatchCreate(course.id)}>
                      + নতুন ব্যাচ
                    </button>
                  </div>

                  {batches.length === 0 ? (
                    <div className={styles.batchEmpty}>কোনো ব্যাচ নেই</div>
                  ) : (
                    <div className={styles.batchList}>
                      {batches.map((batch) => (
                        <div key={batch.id} className={styles.batchItem}>
                          <div className={styles.batchItemTop}>
                            <div className={styles.batchInfo}>
                              <span className={styles.batchNumber}>ব্যাচ #{batch.batchNumber}</span>
                              <span className={`${styles.batchStatus} ${batch.status === "ONGOING"
                                  ? styles.batchStatusOngoing
                                  : batch.status === "COMPLETED"
                                    ? styles.batchStatusCompleted
                                    : styles.batchStatusUpcoming
                                }`}>
                                {batch.status === "UPCOMING" ? "আসন্ন" : batch.status === "ONGOING" ? "চলমান" : "সম্পন্ন"}
                              </span>
                            </div>
                            <div className={styles.batchMeta}>
                              <span>ধারণক্ষমতা: {batch.capacity}</span>
                              <span>শিক্ষার্থী: {batch._count?.enrollments ?? 0}</span>
                              {batch.startDate && (
                                <span>শুরু: {new Date(batch.startDate).toLocaleDateString("bn-BD")}</span>
                              )}
                              {batch.endDate && (
                                <span>শেষ: {new Date(batch.endDate).toLocaleDateString("bn-BD")}</span>
                              )}
                            </div>
                          </div>
                          <div className={styles.batchActions}>
                            <select
                              className={styles.batchStatusSelect}
                              value={batch.status}
                              onChange={(e) => handleBatchStatusToggle(batch.id, e.target.value as "UPCOMING" | "ONGOING" | "COMPLETED")}
                            >
                              <option value="UPCOMING">আসন্ন</option>
                              <option value="ONGOING">চলমান</option>
                              <option value="COMPLETED">সম্পন্ন</option>
                            </select>
                            <button
                              className={`${styles.actionBtn} ${styles.editBtn}`}
                              onClick={() => openBatchEdit(batch)}
                            >
                              সম্পাদনা
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              onClick={() => setDeleteBatchId(batch.id)}
                            >
                              মুছুন
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Course Form Modal (extracted component) ─── */}
      {showModal && (
        <CourseFormModal
          form={form}
          setForm={setForm}
          error={error}
          saving={saving}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Create/Edit Batch Modal */}
      {showBatchModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBatchModal(false)}>
          <div className={`${styles.modal} ${styles.batchModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{batchForm.id ? "ব্যাচ সম্পাদনা" : "নতুন ব্যাচ তৈরি"}</h3>
              <button className={styles.closeBtn} onClick={() => setShowBatchModal(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>ব্যাচ নম্বর *</label>
                  <input
                    type="number"
                    value={batchForm.batchNumber}
                    onChange={(e) => setBatchForm((prev) => ({ ...prev, batchNumber: parseInt(e.target.value) || 1 }))}
                    min={1}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ধারণক্ষমতা *</label>
                  <input
                    type="number"
                    value={batchForm.capacity}
                    onChange={(e) => setBatchForm((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 30 }))}
                    min={1}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>শুরুর তারিখ</label>
                  <input
                    type="date"
                    value={batchForm.startDate}
                    onChange={(e) => setBatchForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>শেষের তারিখ</label>
                  <input
                    type="date"
                    value={batchForm.endDate}
                    onChange={(e) => setBatchForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formFull}`}>
                  <label>স্ট্যাটাস</label>
                  <select
                    value={batchForm.status}
                    onChange={(e) => setBatchForm((prev) => ({ ...prev, status: e.target.value as "UPCOMING" | "ONGOING" | "COMPLETED" }))}
                  >
                    <option value="UPCOMING">আসন্ন</option>
                    <option value="ONGOING">চলমান</option>
                    <option value="COMPLETED">সম্পন্ন</option>
                  </select>
                </div>
              </div>

              {/* Error */}
              {batchError && <div className={styles.errorMsg}>{batchError}</div>}

              {/* Actions */}
              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={() => setShowBatchModal(false)}>বাতিল</button>
                <button className={styles.saveBtn} onClick={handleBatchSave} disabled={batchSaving}>
                  {batchSaving ? "সংরক্ষণ হচ্ছে..." : batchForm.id ? "আপডেট করুন" : "তৈরি করুন"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation */}
      {deleteId && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h4>কোর্স মুছতে চান?</h4>
            <p>এই কোর্সের সাথে সম্পর্কিত সব ডেটা (ফি, সিলেবাস, হাইলাইটস, শিক্ষক, ব্যাচ) মুছে যাবে।</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>বাতিল</button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>মুছে ফেলুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Batch Confirmation */}
      {deleteBatchId && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteBatchId(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h4>ব্যাচ মুছতে চান?</h4>
            <p>এই ব্যাচের সাথে সম্পর্কিত সব এনরোলমেন্ট ডেটা মুছে যাবে।</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteBatchId(null)}>বাতিল</button>
              <button className={styles.confirmDeleteBtn} onClick={handleBatchDelete}>মুছে ফেলুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
