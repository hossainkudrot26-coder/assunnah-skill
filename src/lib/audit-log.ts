/**
 * Audit log utility for admin actions.
 *
 * Records every Create / Update / Delete / Status change made by admins.
 * Uses fire-and-forget pattern — never throws, never blocks the response.
 */

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "TOGGLE";

export interface AuditLogInput {
    userId: string;
    userName?: string | null;
    action: AuditAction;
    entity: string;        // e.g., "course", "testimonial", "team"
    entityId?: string;
    details?: Record<string, unknown>;
}

/**
 * Log an admin action to the database.
 *
 * Fire-and-forget — catches all errors internally so it never
 * disrupts the main operation.
 */
export async function logAdminAction(input: AuditLogInput): Promise<void> {
    try {
        await prisma.auditLog.create({
            data: {
                userId: input.userId,
                userName: input.userName ?? null,
                action: input.action,
                entity: input.entity,
                entityId: input.entityId ?? null,
                details: input.details
                    ? (input.details as Prisma.InputJsonValue)
                    : Prisma.JsonNull,
            },
        });
    } catch (error) {
        // Fire-and-forget — log to console in dev, never throw
        if (process.env.NODE_ENV === "development") {
            console.error("[AuditLog] Failed to record:", error);
        }
    }
}

/**
 * Retrieve recent audit logs for admin dashboard.
 */
export async function getRecentAuditLogs(limit = 50) {
    return prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            user: {
                select: { name: true, email: true, image: true },
            },
        },
    });
}

/**
 * Retrieve audit logs for a specific entity.
 */
export async function getEntityAuditLogs(entity: string, entityId: string) {
    return prisma.auditLog.findMany({
        where: { entity, entityId },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { name: true, email: true },
            },
        },
    });
}
