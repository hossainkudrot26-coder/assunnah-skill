"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { teamMemberSchema, formatZodError } from "@/lib/validations";
import { ZodError } from "zod";
import { sanitize } from "@/lib/sanitize";
import { checkRateLimit, ADMIN_WRITE_LIMIT } from "@/lib/rate-limit";
import { logAdminAction } from "@/lib/audit-log";

// ──────────── GET ALL TEAM MEMBERS (PUBLIC) ────────────

export async function getPublicTeamMembers() {
    return prisma.teamMember.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
    });
}

// ──────────── GET ALL TEAM MEMBERS (ADMIN) ────────────

export async function getAdminTeamMembers() {
    const guard = await requireAdmin();
    if (!guard.authorized) return [];

    return prisma.teamMember.findMany({
        orderBy: { sortOrder: "asc" },
    });
}

// ──────────── CREATE TEAM MEMBER ────────────

export async function createTeamMember(input: unknown) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        const validated = teamMemberSchema.parse(input);

        // Sanitize text fields — defense-in-depth
        const name = sanitize(validated.name);
        const role = sanitize(validated.role);

        const maxSort = await prisma.teamMember.aggregate({
            _max: { sortOrder: true },
        });
        const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

        const initials =
            validated.initials ||
            name.split(" ").map(w => w.charAt(0)).join("").slice(0, 2);

        const member = await prisma.teamMember.create({
            data: {
                name,
                nameBn: validated.nameBn ? sanitize(validated.nameBn) : null,
                role,
                bio: validated.bio ? sanitize(validated.bio) : null,
                image: validated.image || null,
                initials,
                email: validated.email || null,
                phone: validated.phone || null,
                isVisible: validated.isVisible ?? true,
                sortOrder: nextSort,
            },
        });

        revalidatePath("/about");
        revalidatePath("/admin/team");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "CREATE", entity: "team", entityId: member.id, details: { name } });

        return { success: true, member };
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return { success: false, error: formatZodError(error) };
        }
        const message = error instanceof Error ? error.message : "টিম সদস্য তৈরি করতে সমস্যা হয়েছে";
        return { success: false, error: message };
    }
}

// ──────────── UPDATE TEAM MEMBER ────────────

export async function updateTeamMember(input: unknown) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        const rawInput = input as { id?: string; sortOrder?: number } & Record<string, unknown>;
        if (!rawInput.id || typeof rawInput.id !== "string") {
            return { success: false, error: "টিম সদস্য ID দিন" };
        }
        const id = rawInput.id;
        const sortOrder = rawInput.sortOrder;
        const validated = teamMemberSchema.parse(rawInput);

        // Sanitize text fields — defense-in-depth
        const name = sanitize(validated.name);
        const role = sanitize(validated.role);

        const initials =
            validated.initials ||
            name.split(" ").map(w => w.charAt(0)).join("").slice(0, 2);

        const member = await prisma.teamMember.update({
            where: { id },
            data: {
                name,
                nameBn: validated.nameBn ? sanitize(validated.nameBn) : null,
                role,
                bio: validated.bio ? sanitize(validated.bio) : null,
                image: validated.image || null,
                initials,
                email: validated.email || null,
                phone: validated.phone || null,
                isVisible: validated.isVisible ?? true,
                ...(sortOrder !== undefined && { sortOrder }),
            },
        });

        revalidatePath("/about");
        revalidatePath("/admin/team");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "UPDATE", entity: "team", entityId: id, details: { name } });

        return { success: true, member };
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return { success: false, error: formatZodError(error) };
        }
        const message = error instanceof Error ? error.message : "টিম সদস্য আপডেট করতে সমস্যা হয়েছে";
        return { success: false, error: message };
    }
}

// ──────────── DELETE TEAM MEMBER ────────────

export async function deleteTeamMember(id: string) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        await prisma.teamMember.delete({ where: { id } });

        revalidatePath("/about");
        revalidatePath("/admin/team");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "DELETE", entity: "team", entityId: id });

        return { success: true };
    } catch {
        return { success: false, error: "টিম সদস্য মুছতে সমস্যা হয়েছে" };
    }
}

// ──────────── TOGGLE VISIBILITY ────────────

export async function toggleTeamMemberVisibility(id: string, isVisible: boolean) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        await prisma.teamMember.update({
            where: { id },
            data: { isVisible },
        });

        revalidatePath("/about");
        revalidatePath("/admin/team");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "TOGGLE", entity: "team", entityId: id, details: { isVisible } });

        return { success: true };
    } catch {
        return { success: false, error: "পরিবর্তন করতে সমস্যা হয়েছে" };
    }
}
