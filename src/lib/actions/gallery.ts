"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { gallerySchema, formatZodError, type GalleryInput } from "@/lib/validations";
import { ZodError } from "zod";

// ──────────── GET ALL GALLERY ITEMS (ADMIN) ────────────

export async function getAdminGalleryItems() {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.galleryItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

// ──────────── CREATE GALLERY ITEM ────────────



export async function createGalleryItem(input: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const validated = gallerySchema.parse(input);
    await prisma.galleryItem.create({
      data: {
        title: validated.title,
        titleBn: validated.titleBn || null,
        desc: validated.desc || null,
        image: validated.image,
        category: validated.category,
        span: validated.span || null,
        sortOrder: validated.sortOrder ?? 0,
        isVisible: validated.isVisible ?? true,
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) return { success: false, error: formatZodError(error) };
    return { success: false, error: "গ্যালারি আইটেম তৈরি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── UPDATE GALLERY ITEM ────────────

export async function updateGalleryItem(id: string, input: Partial<GalleryInput>) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.galleryItem.update({
      where: { id },
      data: {
        title: input.title,
        titleBn: input.titleBn,
        desc: input.desc,
        image: input.image,
        category: input.category,
        span: input.span,
        sortOrder: input.sortOrder,
        isVisible: input.isVisible,
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");

    return { success: true };
  } catch {
    return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
  }
}

// ──────────── DELETE GALLERY ITEM ────────────

export async function deleteGalleryItem(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.galleryItem.delete({ where: { id } });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");

    return { success: true };
  } catch {
    return { success: false, error: "মুছতে সমস্যা হয়েছে" };
  }
}

// ──────────── TOGGLE VISIBILITY ────────────

export async function toggleGalleryVisibility(id: string, isVisible: boolean) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.galleryItem.update({
      where: { id },
      data: { isVisible },
    });

    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}
