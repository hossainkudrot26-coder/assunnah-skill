"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

// ──────────── GET ALL COURSES (ADMIN) ────────────

export async function getAdminCourses() {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.course.findMany({
    include: {
      fee: true,
      highlights: { orderBy: { sortOrder: "asc" } },
      syllabus: { orderBy: { sortOrder: "asc" } },
      _count: { select: { applications: true, enrollments: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

// ──────────── GET SINGLE COURSE ────────────

export async function getAdminCourse(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return null;

  return prisma.course.findUnique({
    where: { id },
    include: {
      fee: true,
      highlights: { orderBy: { sortOrder: "asc" } },
      syllabus: { orderBy: { sortOrder: "asc" } },
    },
  });
}

// ──────────── CREATE COURSE ────────────

interface CreateCourseInput {
  title: string;
  titleEn?: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  type: string;
  category?: string;
  iconName?: string;
  color?: string;
  batchInfo?: string;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  sortOrder: number;
  fee?: {
    admission: string;
    total?: string;
    scholarship?: string;
    includes?: string[];
  };
  highlights?: string[];
  syllabus?: { title: string; topics: string[] }[];
}

export async function createCourse(input: CreateCourseInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const course = await prisma.course.create({
      data: {
        title: input.title,
        titleEn: input.titleEn || null,
        slug: input.slug,
        shortDesc: input.shortDesc,
        fullDesc: input.fullDesc,
        duration: input.duration,
        type: input.type,
        category: input.category || null,
        iconName: input.iconName || null,
        color: input.color || "#1B8A50",
        batchInfo: input.batchInfo || null,
        status: input.status,
        isFeatured: input.isFeatured,
        sortOrder: input.sortOrder,
        fee: input.fee
          ? {
            create: {
              admission: input.fee.admission,
              total: input.fee.total || null,
              scholarship: input.fee.scholarship || null,
              includes: input.fee.includes || [],
            },
          }
          : undefined,
        highlights: input.highlights
          ? {
            create: input.highlights.map((text, i) => ({
              text,
              sortOrder: i,
            })),
          }
          : undefined,
        syllabus: input.syllabus
          ? {
            create: input.syllabus.map((mod, i) => ({
              title: mod.title,
              topics: mod.topics,
              sortOrder: i,
            })),
          }
          : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return { success: true, course };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "এই slug ইতিমধ্যে ব্যবহৃত হয়েছে" };
    }
    return { success: false, error: "কোর্স তৈরি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── UPDATE COURSE ────────────

interface UpdateCourseInput extends CreateCourseInput {
  id: string;
}

export async function updateCourse(input: UpdateCourseInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    // Delete existing related data for re-creation
    await prisma.$transaction([
      prisma.courseFee.deleteMany({ where: { courseId: input.id } }),
      prisma.courseHighlight.deleteMany({ where: { courseId: input.id } }),
      prisma.syllabusModule.deleteMany({ where: { courseId: input.id } }),
    ]);

    const course = await prisma.course.update({
      where: { id: input.id },
      data: {
        title: input.title,
        titleEn: input.titleEn || null,
        slug: input.slug,
        shortDesc: input.shortDesc,
        fullDesc: input.fullDesc,
        duration: input.duration,
        type: input.type,
        category: input.category || null,
        iconName: input.iconName || null,
        color: input.color || "#1B8A50",
        batchInfo: input.batchInfo || null,
        status: input.status,
        isFeatured: input.isFeatured,
        sortOrder: input.sortOrder,
        fee: input.fee
          ? {
            create: {
              admission: input.fee.admission,
              total: input.fee.total || null,
              scholarship: input.fee.scholarship || null,
              includes: input.fee.includes || [],
            },
          }
          : undefined,
        highlights: input.highlights
          ? {
            create: input.highlights.map((text, i) => ({
              text,
              sortOrder: i,
            })),
          }
          : undefined,
        syllabus: input.syllabus
          ? {
            create: input.syllabus.map((mod, i) => ({
              title: mod.title,
              topics: mod.topics,
              sortOrder: i,
            })),
          }
          : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath(`/courses/${input.slug}`);
    revalidatePath("/admin/courses");

    return { success: true, course };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "এই slug ইতিমধ্যে ব্যবহৃত হয়েছে" };
    }
    return { success: false, error: "কোর্স আপডেট করতে সমস্যা হয়েছে" };
  }
}

// ──────────── DELETE COURSE ────────────

export async function deleteCourse(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.course.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return { success: true };
  } catch {
    return { success: false, error: "কোর্স মুছতে সমস্যা হয়েছে" };
  }
}

// ──────────── TOGGLE STATUS ────────────

export async function toggleCourseStatus(id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.course.update({
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

// ──────────── TOGGLE FEATURED ────────────

export async function toggleCourseFeatured(id: string, isFeatured: boolean) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.course.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/");
    revalidatePath("/admin/courses");

    return { success: true };
  } catch {
    return { success: false, error: "পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}
