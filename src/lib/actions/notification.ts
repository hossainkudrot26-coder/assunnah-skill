"use server";

import prisma from "@/lib/db";
import { requireAdmin, requireOwner } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

// ──────────── GET USER NOTIFICATIONS (OWNER ONLY) ────────────

export async function getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const guard = await requireOwner(userId);
    if (!guard.authorized) return { notifications: [], total: 0, unread: 0 };

    const skip = (page - 1) * limit;

    const [notifications, total, unread] = await Promise.all([
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, unread };
}

// ──────────── GET UNREAD COUNT (OWNER ONLY) ────────────

export async function getUnreadNotificationCount(userId: string) {
    const guard = await requireOwner(userId);
    if (!guard.authorized) return 0;

    return prisma.notification.count({ where: { userId, isRead: false } });
}

// ──────────── MARK AS READ (OWNER ONLY) ────────────

export async function markNotificationAsRead(notificationId: string, userId: string) {
    const guard = await requireOwner(userId);
    if (!guard.authorized) return { success: false, error: guard.error };

    try {
        // Verify notification belongs to user
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            return { success: false, error: "নোটিফিকেশন পাওয়া যায়নি" };
        }

        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return { success: true };
    } catch {
        return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
    }
}

// ──────────── MARK ALL AS READ (OWNER ONLY) ────────────

export async function markAllNotificationsAsRead(userId: string) {
    const guard = await requireOwner(userId);
    if (!guard.authorized) return { success: false, error: guard.error };

    try {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });

        return { success: true };
    } catch {
        return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
    }
}

// ──────────── CREATE NOTIFICATION (INTERNAL HELPER) ────────────

export async function createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: "info" | "success" | "warning" | "error";
    link?: string;
}) {
    try {
        await prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || "info",
                link: data.link || null,
            },
        });
        return { success: true };
    } catch {
        // Notification failure should never break the main flow
        console.error("[Notification] Failed to create notification");
        return { success: false };
    }
}

// ──────────── SEND NOTIFICATION TO ALL STUDENTS (ADMIN ONLY) ────────────

export async function sendBulkNotification(data: {
    title: string;
    message: string;
    type?: "info" | "success" | "warning" | "error";
    link?: string;
}) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    try {
        const students = await prisma.user.findMany({
            where: { role: "STUDENT", isActive: true },
            select: { id: true },
        });

        if (students.length === 0) {
            return { success: false, error: "কোনো শিক্ষার্থী পাওয়া যায়নি" };
        }

        await prisma.notification.createMany({
            data: students.map((s) => ({
                userId: s.id,
                title: data.title,
                message: data.message,
                type: data.type || "info",
                link: data.link || null,
            })),
        });

        revalidatePath("/hub");
        return { success: true, count: students.length };
    } catch {
        return { success: false, error: "নোটিফিকেশন পাঠাতে সমস্যা হয়েছে" };
    }
}

// ──────────── DELETE OLD NOTIFICATIONS (ADMIN ONLY) ────────────

export async function deleteOldNotifications(daysOld: number = 30) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    try {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysOld);

        const result = await prisma.notification.deleteMany({
            where: { createdAt: { lt: cutoff }, isRead: true },
        });

        return { success: true, deleted: result.count };
    } catch {
        return { success: false, error: "মুছতে সমস্যা হয়েছে" };
    }
}
