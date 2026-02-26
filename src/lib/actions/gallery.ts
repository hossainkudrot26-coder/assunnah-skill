"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

// ──────────── GET ALL GALLERY ITEMS (ADMIN) ────────────

export async function getAdminGalleryItems() {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.galleryItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

// ──────────── CREATE GALLERY ITEM ────────────

interface GalleryInput {
  title: string;
  titleBn?: string;
  desc?: string;
  image: string;
  category: string;
  span?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export async function createGalleryItem(input: GalleryInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.galleryItem.create({
      data: {
        title: input.title,
        titleBn: input.titleBn || null,
        desc: input.desc || null,
        image: input.image,
        category: input.category,
        span: input.span || null,
        sortOrder: input.sortOrder ?? 0,
        isVisible: input.isVisible ?? true,
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");

    return { success: true };
  } catch {
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
