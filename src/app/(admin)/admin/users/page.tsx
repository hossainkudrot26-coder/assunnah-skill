"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminUsers, updateUserRole, toggleUserActive } from "@/lib/actions/user";
import styles from "../admin-dashboard.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN";

interface UserItem {
    id: string;
    name: string;
    nameBn: string | null;
    email: string;
    phone: string | null;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    _count: { applications: number; enrollments: number };
}

const roleLabels: Record<UserRole, string> = {
    STUDENT: "শিক্ষার্থী", INSTRUCTOR: "ইন্সট্রাক্টর",
    ADMIN: "অ্যাডমিন", SUPER_ADMIN: "সুপার অ্যাডমিন",
};

const roleBadgeClass: Record<UserRole, string> = {
    STUDENT: "badgeInfo", INSTRUCTOR: "badgeSuccess",
    ADMIN: "badgeWarning", SUPER_ADMIN: "badgePurple",
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AdminUsers() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const loadData = useCallback(async () => {
        setLoading(true);
        const result = await getAdminUsers({
            ...(search && { search }),
            ...(filterRole && { role: filterRole as UserRole }),
        });
        setUsers(result.users as UserItem[]);
        setTotal(result.total);
        setLoading(false);
    }, [search, filterRole]);

    useEffect(() => { loadData(); }, [loadData]);

    // Debounced search
    const [searchInput, setSearchInput] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    async function handleRoleChange(userId: string, role: UserRole) {
        const result = await updateUserRole(userId, role);
        if (result.success) {
            setSuccess("ভূমিকা আপডেট হয়েছে"); loadData();
            setTimeout(() => setSuccess(""), 3000);
        } else {
            setError(result.error || "সমস্যা হয়েছে");
            setTimeout(() => setError(""), 3000);
        }
    }

    async function handleToggleActive(userId: string, currentActive: boolean) {
        const result = await toggleUserActive(userId, !currentActive);
        if (result.success) {
            setSuccess(currentActive ? "ব্যবহারকারী নিষ্ক্রিয় করা হয়েছে" : "ব্যবহারকারী সক্রিয় করা হয়েছে");
            loadData();
            setTimeout(() => setSuccess(""), 3000);
        } else {
            setError(result.error || "সমস্যা হয়েছে");
            setTimeout(() => setError(""), 3000);
        }
    }

    if (loading && users.length === 0) {
        return (
            <div className={styles.page}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>ব্যবহারকারী ব্যবস্থাপনা</h1>
                </div>
                <div className={styles.emptyState}>লোড হচ্ছে...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>ব্যবহারকারী ব্যবস্থাপনা</h1>
                    <p className={styles.pageSubtitle}>মোট {total} জন ব্যবহারকারী</p>
                </div>
            </div>

            {success && <div className={styles.alertSuccess}>{success}</div>}
            {error && <div className={styles.alertError}>{error}</div>}

            {/* Filters */}
            <div className={styles.filterBar}>
                <input className={styles.filterInput} type="text" value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..." />
                <select className={styles.filterSelect} value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}>
                    <option value="">সকল ভূমিকা</option>
                    {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>ব্যবহারকারী</th>
                            <th className={styles.th}>যোগাযোগ</th>
                            <th className={styles.thCenter}>আবেদন</th>
                            <th className={styles.thCenter}>এনরোলমেন্ট</th>
                            <th className={styles.thCenter}>ভূমিকা</th>
                            <th className={styles.thCenter}>স্ট্যাটাস</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={user.isActive ? styles.tr : styles.trFaded}>
                                <td className={styles.td}>
                                    <div className={styles.tdName}>{user.name}</div>
                                    <div className={styles.tdMeta}>
                                        {new Date(user.createdAt).toLocaleDateString("bn-BD")} থেকে
                                    </div>
                                </td>
                                <td className={styles.td}>
                                    <div>{user.email}</div>
                                    {user.phone && <div className={styles.tdMeta}>{user.phone}</div>}
                                </td>
                                <td className={styles.tdCenter}>{user._count.applications}</td>
                                <td className={styles.tdCenter}>{user._count.enrollments}</td>
                                <td className={styles.tdCenter}>
                                    <select
                                        className={`${styles.formSelectCompact} ${styles[roleBadgeClass[user.role]]}`}
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                    >
                                        {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </td>
                                <td className={styles.tdCenter}>
                                    <button
                                        className={`${styles.statusToggle} ${user.isActive ? styles.statusActive : styles.statusInactive}`}
                                        onClick={() => handleToggleActive(user.id, user.isActive)}
                                    >
                                        {user.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className={styles.emptyState}>কোনো ব্যবহারকারী পাওয়া যায়নি</div>}
            </div>
        </div>
    );
}
