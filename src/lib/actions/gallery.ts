"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ──────────── GET ALL GALLERY ITEMS (ADMIN) ────────────

export async function getAdminGalleryItems() {
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
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

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
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

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
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

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
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

  await prisma.galleryItem.update({
    where: { id },
    data: { isVisible },
  });

  revalidatePath("/gallery");
  return { success: true };
}
