"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { downloadSchema, formatZodError, type DownloadInput } from "@/lib/validations";
import { ZodError } from "zod";

// ──────────── PUBLIC ────────────

export async function getPublishedDownloads() {
  return prisma.download.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

// ──────────── ADMIN ────────────

export async function getAdminDownloads() {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.download.findMany({
    orderBy: { sortOrder: "asc" },
  });
}



export async function createDownload(data: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const validated = downloadSchema.parse(data);
    await prisma.download.create({
      data: {
        title: validated.title,
        description: validated.description,
        fileUrl: validated.fileUrl || null,
        fileType: validated.fileType || "PDF",
        fileSize: validated.fileSize || null,
        category: validated.category,
        iconColor: validated.iconColor || "#1B8A50",
        sortOrder: validated.sortOrder ?? 0,
        isPublished: validated.isPublished ?? true,
      },
    });

    revalidatePath("/downloads");
    revalidatePath("/admin/downloads");
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) return { success: false, error: formatZodError(error) };
    return { success: false, error: "তৈরি করতে সমস্যা হয়েছে" };
  }
}

export async function updateDownload(id: string, data: Partial<DownloadInput>) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.download.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,
        category: data.category,
        iconColor: data.iconColor,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/downloads");
    revalidatePath("/admin/downloads");
    return { success: true };
  } catch {
    return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
  }
}

export async function deleteDownload(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.download.delete({ where: { id } });
    revalidatePath("/downloads");
    revalidatePath("/admin/downloads");
    return { success: true };
  } catch {
    return { success: false, error: "মুছতে সমস্যা হয়েছে" };
  }
}
