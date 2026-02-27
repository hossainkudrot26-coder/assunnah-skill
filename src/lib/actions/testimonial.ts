"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { testimonialSchema, formatZodError } from "@/lib/validations";
import { ZodError } from "zod";
import { sanitize } from "@/lib/sanitize";
import { checkRateLimit, ADMIN_WRITE_LIMIT } from "@/lib/rate-limit";
import { logAdminAction } from "@/lib/audit-log";

// ──────────── GET PUBLIC TESTIMONIALS (Stories page) ────────────

export async function getPublicTestimonials() {
    return prisma.testimonial.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        select: {
            id: true,
            name: true,
            initials: true,
            batch: true,
            story: true,
            achievement: true,
            color: true,
            course: true,
            currentRole: true,
            monthlyIncome: true,
            rating: true,
        },
    });
}

// ──────────── GET ALL TESTIMONIALS (ADMIN) ────────────

export async function getAdminTestimonials() {
    const guard = await requireAdmin();
    if (!guard.authorized) return [];

    return prisma.testimonial.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });
}

// ──────────── CREATE TESTIMONIAL ────────────

export async function createTestimonial(input: unknown) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        const validated = testimonialSchema.parse(input);

        // Sanitize text fields — defense-in-depth
        const name = sanitize(validated.name);
        const story = sanitize(validated.story);
        const achievement = sanitize(validated.achievement);

        // Auto-assign sortOrder
        const maxSort = await prisma.testimonial.aggregate({
            _max: { sortOrder: true },
        });
        const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

        // Auto-generate initials if not provided
        const initials =
            validated.initials ||
            name
                .split(" ")
                .map((w) => w.charAt(0))
                .join("")
                .slice(0, 2);

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                initials,
                batch: sanitize(validated.batch),
                story,
                achievement,
                color: validated.color || "#1B8A50",
                isVisible: validated.isVisible ?? true,
                sortOrder: nextSort,
                course: validated.course || null,
                currentRole: validated.currentRole || null,
                monthlyIncome: validated.monthlyIncome || null,
                rating: validated.rating ?? 5,
            },
        });

        revalidatePath("/");
        revalidatePath("/stories");
        revalidatePath("/admin/testimonials");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "CREATE", entity: "testimonial", entityId: testimonial.id, details: { name } });

        return { success: true, testimonial };
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return { success: false, error: formatZodError(error) };
        }
        const message =
            error instanceof Error
                ? error.message
                : "প্রশংসাপত্র তৈরি করতে সমস্যা হয়েছে";
        return { success: false, error: message };
    }
}

// ──────────── UPDATE TESTIMONIAL ────────────

export async function updateTestimonial(input: unknown) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        const rawInput = input as { id?: string; sortOrder?: number } & Record<string, unknown>;
        if (!rawInput.id || typeof rawInput.id !== "string") {
            return { success: false, error: "প্রশংসাপত্র ID দিন" };
        }
        const id = rawInput.id;
        const sortOrder = rawInput.sortOrder;
        const validated = testimonialSchema.parse(rawInput);

        // Sanitize text fields — defense-in-depth
        const name = sanitize(validated.name);
        const story = sanitize(validated.story);
        const achievement = sanitize(validated.achievement);

        const initials =
            validated.initials ||
            name
                .split(" ")
                .map((w) => w.charAt(0))
                .join("")
                .slice(0, 2);

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                name,
                initials,
                batch: sanitize(validated.batch),
                story,
                achievement,
                color: validated.color || "#1B8A50",
                isVisible: validated.isVisible ?? true,
                ...(sortOrder !== undefined && { sortOrder }),
                course: validated.course ? sanitize(validated.course) : null,
                currentRole: validated.currentRole ? sanitize(validated.currentRole) : null,
                monthlyIncome: validated.monthlyIncome ? sanitize(validated.monthlyIncome) : null,
                rating: validated.rating ?? 5,
            },
        });

        revalidatePath("/");
        revalidatePath("/stories");
        revalidatePath("/admin/testimonials");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "UPDATE", entity: "testimonial", entityId: id, details: { name } });

        return { success: true, testimonial };
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return { success: false, error: formatZodError(error) };
        }
        const message =
            error instanceof Error
                ? error.message
                : "প্রশংসাপত্র আপডেট করতে সমস্যা হয়েছে";
        return { success: false, error: message };
    }
}

// ──────────── DELETE TESTIMONIAL ────────────

export async function deleteTestimonial(id: string) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        await prisma.testimonial.delete({ where: { id } });

        revalidatePath("/");
        revalidatePath("/stories");
        revalidatePath("/admin/testimonials");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "DELETE", entity: "testimonial", entityId: id });

        return { success: true };
    } catch {
        return { success: false, error: "প্রশংসাপত্র মুছতে সমস্যা হয়েছে" };
    }
}

// ──────────── TOGGLE VISIBILITY ────────────

export async function toggleTestimonialVisibility(
    id: string,
    isVisible: boolean
) {
    const guard = await requireAdmin();
    if (!guard.authorized) return { success: false, error: guard.error };

    const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
    if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

    try {
        await prisma.testimonial.update({
            where: { id },
            data: { isVisible },
        });

        revalidatePath("/");
        revalidatePath("/stories");

        logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "TOGGLE", entity: "testimonial", entityId: id, details: { isVisible } });

        return { success: true };
    } catch {
        return { success: false, error: "পরিবর্তন করতে সমস্যা হয়েছে" };
    }
}
