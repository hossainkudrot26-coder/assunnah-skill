"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminEnrollments, updateEnrollmentStatus } from "@/lib/actions/user";
import { getAdminCourses } from "@/lib/actions/course";
import styles from "../admin-dashboard.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type EnrollmentStatus = "ENROLLED" | "IN_PROGRESS" | "COMPLETED" | "DROPPED";

interface EnrollmentItem {
    id: string;
    status: EnrollmentStatus;
    progress: number;
    enrolledAt: Date;
    completedAt: Date | null;
    user: { id: string; name: string; email: string; phone: string | null };
    course: { id: string; title: string; slug: string };
    batch: { id: string; batchNumber: number; status: string } | null;
}

const statusLabels: Record<EnrollmentStatus, string> = {
    ENROLLED: "ভর্তি", IN_PROGRESS: "চলমান", COMPLETED: "সম্পন্ন", DROPPED: "বাদ",
};

const statusBadgeClass: Record<EnrollmentStatus, string> = {
    ENROLLED: "badgeInfo", IN_PROGRESS: "badgeWarning", COMPLETED: "badgeSuccess", DROPPED: "badgeDanger",
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
    const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCourse, setFilterCourse] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const loadData = useCallback(async () => {
        setLoading(true);
        const [enrData, courseData] = await Promise.all([
            getAdminEnrollments({
                ...(filterCourse && { courseId: filterCourse }),
                ...(filterStatus && { status: filterStatus }),
            }),
            getAdminCourses(),
        ]);
        setEnrollments(enrData as EnrollmentItem[]);
        setCourses((courseData as { id: string; title: string }[]).map(c => ({ id: c.id, title: c.title })));
        setLoading(false);
    }, [filterCourse, filterStatus]);

    useEffect(() => { loadData(); }, [loadData]);

    async function handleStatusChange(id: string, status: EnrollmentStatus) {
        const result = await updateEnrollmentStatus(id, status);
        if (result.success) loadData();
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>এনরোলমেন্ট ব্যবস্থাপনা</h1>
                </div>
                <div className={styles.emptyState}>লোড হচ্ছে...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>এনরোলমেন্ট ব্যবস্থাপনা</h1>
                    <p className={styles.pageSubtitle}>মোট {enrollments.length}টি এনরোলমেন্ট</p>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filterBar}>
                <select className={styles.filterSelect} value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                    <option value="">সকল কোর্স</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">সকল স্ট্যাটাস</option>
                    {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>শিক্ষার্থী</th>
                            <th className={styles.th}>কোর্স</th>
                            <th className={styles.thCenter}>ব্যাচ</th>
                            <th className={styles.thCenter}>অগ্রগতি</th>
                            <th className={styles.thCenter}>স্ট্যাটাস</th>
                            <th className={styles.thRight}>ভর্তির তারিখ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map((enr) => (
                            <tr key={enr.id} className={styles.tr}>
                                <td className={styles.td}>
                                    <div className={styles.tdName}>{enr.user.name}</div>
                                    <div className={styles.tdMeta}>{enr.user.email}</div>
                                </td>
                                <td className={styles.td}>{enr.course.title}</td>
                                <td className={styles.tdCenter}>
                                    {enr.batch ? `ব্যাচ ${enr.batch.batchNumber}` : "—"}
                                </td>
                                <td className={styles.tdCenter}>
                                    <div className={styles.progressWrap}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{
                                                    width: `${enr.progress}%`,
                                                    background: enr.progress === 100 ? "#059669" : "#3B82F6",
                                                }}
                                            />
                                        </div>
                                        <span className={styles.progressLabel}>{enr.progress}%</span>
                                    </div>
                                </td>
                                <td className={styles.tdCenter}>
                                    <select
                                        className={`${styles.formSelectCompact} ${styles[statusBadgeClass[enr.status]]}`}
                                        value={enr.status}
                                        onChange={(e) => handleStatusChange(enr.id, e.target.value as EnrollmentStatus)}
                                    >
                                        {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </td>
                                <td className={styles.tdRight}>
                                    <span className={styles.tdMeta}>{new Date(enr.enrolledAt).toLocaleDateString("bn-BD")}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {enrollments.length === 0 && <div className={styles.emptyState}>কোনো এনরোলমেন্ট পাওয়া যায়নি</div>}
            </div>
        </div>
    );
}
