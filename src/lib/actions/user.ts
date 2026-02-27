"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import type { Role } from "@prisma/client";

// ──────────── GET ALL USERS (ADMIN) ────────────

interface GetUsersOptions {
    role?: Role;
    search?: string;
    page?: number;
    limit?: number;
}

export async function getAdminUsers(options: GetUsersOptions = {}) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { users: [], total: 0 };

    const { role, search, page = 1, limit = 50 } = options;

    const where = {
        ...(role && { role }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { phone: { contains: search } },
            ],
        }),
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                nameBn: true,
                email: true,
                phone: true,
                role: true,
                gender: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: {
                        applications: true,
                        enrollments: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    return { users, total };
}

// ──────────── UPDATE USER ROLE ────────────

export async function updateUserRole(userId: string, role: Role) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    // Prevent changing own role (safety)
    if (guard.authorized && guard.session.user.id === userId) {
        return { success: false, error: "নিজের ভূমিকা পরিবর্তন করা যাবে না" };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { success: false, error: "ভূমিকা পরিবর্তন করতে সমস্যা হয়েছে" };
    }
}

// ──────────── TOGGLE USER ACTIVE STATUS ────────────

export async function toggleUserActive(userId: string, isActive: boolean) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    // Prevent deactivating self
    if (guard.authorized && guard.session.user.id === userId) {
        return { success: false, error: "নিজেকে নিষ্ক্রিয় করা যাবে না" };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { success: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে" };
    }
}

// ──────────── GET ENROLLMENTS (ADMIN) ────────────

interface GetEnrollmentsOptions {
    courseId?: string;
    batchId?: string;
    status?: string;
}

export async function getAdminEnrollments(options: GetEnrollmentsOptions = {}) {
    const guard = await requireAdmin();
    if (!guard.authorized) return [];

    const { courseId, batchId, status } = options;

    return prisma.enrollment.findMany({
        where: {
            ...(courseId && { courseId }),
            ...(batchId && { batchId }),
            ...(status && { status: status as "ENROLLED" | "IN_PROGRESS" | "COMPLETED" | "DROPPED" }),
        },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            course: { select: { id: true, title: true, slug: true } },
            batch: { select: { id: true, batchNumber: true, status: true } },
        },
        orderBy: { enrolledAt: "desc" },
    });
}

// ──────────── UPDATE ENROLLMENT STATUS ────────────

export async function updateEnrollmentStatus(
    enrollmentId: string,
    status: "ENROLLED" | "IN_PROGRESS" | "COMPLETED" | "DROPPED"
) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    try {
        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                status,
                ...(status === "COMPLETED" && { completedAt: new Date(), progress: 100 }),
            },
        });

        revalidatePath("/admin/enrollments");
        return { success: true };
    } catch {
        return { success: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে" };
    }
}
