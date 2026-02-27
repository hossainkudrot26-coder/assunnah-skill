"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { noticeSchema, formatZodError, type NoticeInput } from "@/lib/validations";
import { ZodError } from "zod";

// ──────────── PUBLIC ────────────

export async function getPublishedNotices() {
  return prisma.notice.findMany({
    where: { isPublished: true },
    orderBy: [{ isImportant: "desc" }, { publishedAt: "desc" }],
  });
}

// ──────────── ADMIN ────────────

export async function getAdminNotices() {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.notice.findMany({
    orderBy: [{ isImportant: "desc" }, { publishedAt: "desc" }],
  });
}



export async function createNotice(data: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const validated = noticeSchema.parse(data);
    await prisma.notice.create({
      data: {
        title: validated.title,
        description: validated.description,
        type: validated.type,
        isImportant: validated.isImportant ?? false,
        isPublished: validated.isPublished ?? true,
        link: validated.link || null,
        publishedAt: new Date(),
      },
    });

    revalidatePath("/notices");
    revalidatePath("/admin/notices");
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) return { success: false, error: formatZodError(error) };
    return { success: false, error: "নোটিশ তৈরি করতে সমস্যা হয়েছে" };
  }
}

export async function updateNotice(id: string, data: Partial<NoticeInput>) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.notice.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        isImportant: data.isImportant,
        isPublished: data.isPublished,
        link: data.link,
      },
    });

    revalidatePath("/notices");
    revalidatePath("/admin/notices");
    return { success: true };
  } catch {
    return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
  }
}

export async function deleteNotice(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.notice.delete({ where: { id } });
    revalidatePath("/notices");
    revalidatePath("/admin/notices");
    return { success: true };
  } catch {
    return { success: false, error: "মুছতে সমস্যা হয়েছে" };
  }
}

export async function toggleNoticePublish(id: string, isPublished: boolean) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.notice.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath("/notices");
    revalidatePath("/admin/notices");
    return { success: true };
  } catch {
    return { success: false, error: "পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}
