"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { batchSchema, formatZodError, type BatchInput } from "@/lib/validations";
import { ZodError } from "zod";

// ──────────── GET ALL BATCHES (ADMIN) ────────────

export async function getAdminBatches(courseId?: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.batch.findMany({
    where: courseId ? { courseId } : undefined,
    include: {
      course: { select: { id: true, title: true, slug: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: [{ course: { sortOrder: "asc" } }, { batchNumber: "asc" }],
  });
}

// ──────────── CREATE BATCH ────────────



export async function createBatch(input: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const validated = batchSchema.parse(input);
    const batch = await prisma.batch.create({
      data: {
        courseId: validated.courseId,
        batchNumber: validated.batchNumber,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        capacity: validated.capacity,
        status: validated.status,
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return { success: true, batch };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "এই ব্যাচ নম্বর ইতিমধ্যে বিদ্যমান" };
    }
    return { success: false, error: "ব্যাচ তৈরি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── UPDATE BATCH ────────────

interface UpdateBatchInput {
  id: string;
  batchNumber: number;
  startDate?: string;
  endDate?: string;
  capacity: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
}

export async function updateBatch(input: UpdateBatchInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const batch = await prisma.batch.update({
      where: { id: input.id },
      data: {
        batchNumber: input.batchNumber,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        capacity: input.capacity,
        status: input.status,
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return { success: true, batch };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "এই ব্যাচ নম্বর ইতিমধ্যে বিদ্যমান" };
    }
    return { success: false, error: "ব্যাচ আপডেট করতে সমস্যা হয়েছে" };
  }
}

// ──────────── DELETE BATCH ────────────

export async function deleteBatch(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.batch.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return { success: true };
  } catch {
    return { success: false, error: "ব্যাচ মুছতে সমস্যা হয়েছে" };
  }
}

// ──────────── TOGGLE BATCH STATUS ────────────

export async function toggleBatchStatus(id: string, status: "UPCOMING" | "ONGOING" | "COMPLETED") {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.batch.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return { success: true };
  } catch {
    return { success: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}
