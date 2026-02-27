"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { courseSchema, formatZodError, type CourseInput } from "@/lib/validations";
import { ZodError } from "zod";
import { sanitize } from "@/lib/sanitize";
import { checkRateLimit, ADMIN_WRITE_LIMIT } from "@/lib/rate-limit";
import { logAdminAction } from "@/lib/audit-log";

// ──────────── GET ALL COURSES (ADMIN) ────────────

export async function getAdminCourses() {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.course.findMany({
    include: {
      fee: true,
      highlights: { orderBy: { sortOrder: "asc" } },
      syllabus: { orderBy: { sortOrder: "asc" } },
      instructors: { orderBy: { sortOrder: "asc" } },
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
      instructors: { orderBy: { sortOrder: "asc" } },
    },
  });
}

// ──────────── CREATE COURSE ────────────

export async function createCourse(input: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
  if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

  try {
    // Zod validation — Bengali error messages
    const validated = courseSchema.parse(input);

    // Sanitize text fields — defense-in-depth against stored XSS
    const title = sanitize(validated.title);
    const slug = validated.slug; // slug is already regex-validated, no HTML possible
    const shortDesc = sanitize(validated.shortDesc);
    const fullDesc = sanitize(validated.fullDesc);

    const course = await prisma.course.create({
      data: {
        title,
        titleEn: validated.titleEn ? sanitize(validated.titleEn) : null,
        slug,
        shortDesc,
        fullDesc,
        duration: validated.duration,
        type: validated.type,
        category: validated.category || null,
        iconName: validated.iconName || null,
        color: validated.color || "#1B8A50",
        batchInfo: validated.batchInfo || null,
        status: validated.status,
        isFeatured: validated.isFeatured,
        sortOrder: validated.sortOrder,
        fee: validated.fee
          ? {
            create: {
              admission: validated.fee.admission,
              total: validated.fee.total || null,
              scholarship: validated.fee.scholarship || null,
              includes: validated.fee.includes || [],
            },
          }
          : undefined,
        highlights: validated.highlights
          ? {
            create: validated.highlights.map((text, i) => ({
              text,
              sortOrder: i,
            })),
          }
          : undefined,
        syllabus: validated.syllabus
          ? {
            create: validated.syllabus.map((mod, i) => ({
              title: mod.title,
              topics: mod.topics,
              sortOrder: i,
            })),
          }
          : undefined,
        instructors: validated.instructors && validated.instructors.length > 0
          ? {
            create: validated.instructors.map((inst, i) => ({
              name: inst.name,
              role: inst.role,
              bio: inst.bio,
              initials: inst.initials,
              sortOrder: i,
            })),
          }
          : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "CREATE", entity: "course", entityId: course.id, details: { title: title } });

    return { success: true, course };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: formatZodError(error) };
    }
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "এই slug ইতিমধ্যে ব্যবহৃত হয়েছে" };
    }
    return { success: false, error: "কোর্স তৈরি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── UPDATE COURSE ────────────

export async function updateCourse(input: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
  if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

  try {
    // Validate with Zod (id is separate, validated manually)
    const rawInput = input as { id?: string } & Record<string, unknown>;
    if (!rawInput.id || typeof rawInput.id !== "string") {
      return { success: false, error: "কোর্স ID দিন" };
    }
    const id = rawInput.id;
    const validated = courseSchema.parse(rawInput);

    // Sanitize text fields — defense-in-depth
    const title = sanitize(validated.title);
    const slug = validated.slug;
    const shortDesc = sanitize(validated.shortDesc);
    const fullDesc = sanitize(validated.fullDesc);

    // Single atomic transaction — if anything fails, everything rolls back
    const course = await prisma.$transaction(async (tx) => {
      // Step 1: Delete existing child records
      await tx.courseFee.deleteMany({ where: { courseId: id } });
      await tx.courseHighlight.deleteMany({ where: { courseId: id } });
      await tx.syllabusModule.deleteMany({ where: { courseId: id } });
      await tx.courseInstructor.deleteMany({ where: { courseId: id } });

      // Step 2: Update course + recreate children — all in same transaction
      return tx.course.update({
        where: { id },
        data: {
          title,
          titleEn: validated.titleEn ? sanitize(validated.titleEn) : null,
          slug,
          shortDesc,
          fullDesc,
          duration: validated.duration,
          type: validated.type,
          category: validated.category || null,
          iconName: validated.iconName || null,
          color: validated.color || "#1B8A50",
          batchInfo: validated.batchInfo || null,
          status: validated.status,
          isFeatured: validated.isFeatured,
          sortOrder: validated.sortOrder,
          fee: validated.fee
            ? {
              create: {
                admission: validated.fee.admission,
                total: validated.fee.total || null,
                scholarship: validated.fee.scholarship || null,
                includes: validated.fee.includes || [],
              },
            }
            : undefined,
          highlights: validated.highlights
            ? {
              create: validated.highlights.map((text, i) => ({
                text,
                sortOrder: i,
              })),
            }
            : undefined,
          syllabus: validated.syllabus
            ? {
              create: validated.syllabus.map((mod, i) => ({
                title: mod.title,
                topics: mod.topics,
                sortOrder: i,
              })),
            }
            : undefined,
          instructors: validated.instructors && validated.instructors.length > 0
            ? {
              create: validated.instructors.map((inst, i) => ({
                name: inst.name,
                role: inst.role,
                bio: inst.bio,
                initials: inst.initials,
                sortOrder: i,
              })),
            }
            : undefined,
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath(`/courses/${validated.slug}`);
    revalidatePath("/admin/courses");

    logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "UPDATE", entity: "course", entityId: id, details: { title: title } });

    return { success: true, course };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: formatZodError(error) };
    }
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

  const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
  if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

  try {
    await prisma.course.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "DELETE", entity: "course", entityId: id });

    return { success: true };
  } catch {
    return { success: false, error: "কোর্স মুছতে সমস্যা হয়েছে" };
  }
}

// ──────────── TOGGLE STATUS ────────────

export async function toggleCourseStatus(id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
  if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

  try {
    await prisma.course.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "STATUS_CHANGE", entity: "course", entityId: id, details: { status } });

    return { success: true };
  } catch {
    return { success: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}

// ──────────── TOGGLE FEATURED ────────────

export async function toggleCourseFeatured(id: string, isFeatured: boolean) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const rl = checkRateLimit(`admin:${guard.session.user.id}`, ADMIN_WRITE_LIMIT);
  if (!rl.allowed) return { success: false, error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };

  try {
    await prisma.course.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/");
    revalidatePath("/admin/courses");

    logAdminAction({ userId: guard.session.user.id, userName: guard.session.user.name, action: "TOGGLE", entity: "course", entityId: id, details: { isFeatured } });

    return { success: true };
  } catch {
    return { success: false, error: "পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}

// ──────────── FAQ MANAGEMENT ────────────

export async function getCourseFAQs(courseId: string) {
  return prisma.courseFAQ.findMany({
    where: { courseId },
    orderBy: { sortOrder: "asc" },
  });
}

interface CreateFAQInput {
  courseId: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

export async function createFAQ(input: CreateFAQInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    // Auto-assign sortOrder if not provided
    const maxSort = await prisma.courseFAQ.aggregate({
      where: { courseId: input.courseId },
      _max: { sortOrder: true },
    });
    const nextSort = input.sortOrder ?? ((maxSort._max.sortOrder ?? -1) + 1);

    const faq = await prisma.courseFAQ.create({
      data: {
        courseId: input.courseId,
        question: input.question,
        answer: input.answer,
        sortOrder: nextSort,
      },
    });

    revalidatePath("/faq");
    revalidatePath(`/courses/${input.courseId}`);
    revalidatePath("/admin/courses");

    return { success: true, faq };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "FAQ তৈরি করতে সমস্যা হয়েছে";
    return { success: false, error: message };
  }
}

interface UpdateFAQInput {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

export async function updateFAQ(input: UpdateFAQInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const faq = await prisma.courseFAQ.update({
      where: { id: input.id },
      data: {
        question: input.question,
        answer: input.answer,
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      },
    });

    revalidatePath("/faq");
    revalidatePath("/admin/courses");

    return { success: true, faq };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "FAQ আপডেট করতে সমস্যা হয়েছে";
    return { success: false, error: message };
  }
}

export async function deleteFAQ(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.courseFAQ.delete({ where: { id } });

    revalidatePath("/faq");
    revalidatePath("/admin/courses");

    return { success: true };
  } catch {
    return { success: false, error: "FAQ মুছতে সমস্যা হয়েছে" };
  }
}
