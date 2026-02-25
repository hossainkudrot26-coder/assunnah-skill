"use server";

import prisma from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import type { ApplicationInput } from "@/lib/validations";
import { auth } from "@/lib/auth";

export async function submitApplication(data: ApplicationInput) {
  try {
    const validated = applicationSchema.parse(data);
    const session = await auth();

    // Check for duplicate application
    const existing = await prisma.application.findFirst({
      where: {
        applicantPhone: validated.applicantPhone,
        courseId: validated.courseId,
        status: { in: ["PENDING", "UNDER_REVIEW", "ACCEPTED"] },
      },
    });

    if (existing) {
      return { success: false, error: "আপনি ইতোমধ্যে এই কোর্সে আবেদন করেছেন।" };
    }

    await prisma.application.create({
      data: {
        ...validated,
        applicantEmail: validated.applicantEmail || null,
        dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
        userId: session?.user?.id || null,
        status: "PENDING",
      },
    });

    return { success: true, message: "আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করবো।" };
  } catch (error: any) {
    if (error?.issues) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "আবেদন জমা দিতে সমস্যা হয়েছে।" };
  }
}

export async function getApplications(
  status?: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;
  const where = status ? { status: status as any } : {};

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        course: { select: { title: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return { applications, total, pages: Math.ceil(total / limit) };
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  reviewNotes?: string
) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

  await prisma.application.update({
    where: { id },
    data: {
      status: status as any,
      reviewNotes: reviewNotes || undefined,
      reviewedBy: session.user.id,
    },
  });

  return { success: true };
}

// ──────────── GET APPLICATION DETAIL ────────────

export async function getApplicationDetail(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, slug: true, duration: true, type: true } },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
}

// ──────────── ENROLL STUDENT ────────────

export async function enrollStudent(applicationId: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { course: true },
  });

  if (!application) return { success: false, error: "আবেদন পাওয়া যায়নি" };
  if (application.status !== "ACCEPTED") return { success: false, error: "আবেদন গৃহীত হয়নি" };

  try {
    // If the applicant has a user account, use that; otherwise create one
    let userId = application.userId;

    if (!userId) {
      // Create a student account
      const newUser = await prisma.user.create({
        data: {
          name: application.applicantName,
          email: application.applicantEmail || `${application.applicantPhone}@student.assunnahskill.org`,
          phone: application.applicantPhone,
          role: "STUDENT",
          gender: application.gender || undefined,
          dateOfBirth: application.dateOfBirth || undefined,
          nidNumber: application.nidNumber || undefined,
          address: application.address || undefined,
          guardianName: application.fatherName || undefined,
        },
      });
      userId = newUser.id;

      // Link application to user
      await prisma.application.update({
        where: { id: applicationId },
        data: { userId: newUser.id },
      });
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId, courseId: application.courseId },
    });

    if (existingEnrollment) {
      return { success: false, error: "শিক্ষার্থী ইতিমধ্যে এই কোর্সে ভর্তি আছেন" };
    }

    // Find an active batch for the course
    const activeBatch = await prisma.batch.findFirst({
      where: {
        courseId: application.courseId,
        status: { in: ["UPCOMING", "ONGOING"] },
      },
      orderBy: { batchNumber: "desc" },
    });

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId: application.courseId,
        batchId: activeBatch?.id || null,
        status: "ENROLLED",
      },
    });

    return { success: true, message: "শিক্ষার্থী সফলভাবে ভর্তি করা হয়েছে!" };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "শিক্ষার্থী ইতিমধ্যে ভর্তি আছেন" };
    }
    return { success: false, error: "ভর্তি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── GET ENROLLMENTS ────────────

export async function getEnrollments(courseId?: string) {
  const where = courseId ? { courseId } : {};

  return prisma.enrollment.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      course: { select: { id: true, title: true, slug: true } },
      batch: { select: { id: true, batchNumber: true, status: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });
}

// ──────────── UPDATE ENROLLMENT STATUS ────────────

export async function updateEnrollmentStatus(id: string, status: string, progress?: number) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

  await prisma.enrollment.update({
    where: { id },
    data: {
      status: status as any,
      progress: progress !== undefined ? progress : undefined,
      completedAt: status === "COMPLETED" ? new Date() : undefined,
    },
  });

  return { success: true };
}

// ──────────── GET USER APPLICATIONS ────────────

export async function getUserApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, slug: true, duration: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ──────────── GET USER ENROLLMENTS ────────────

export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, slug: true, duration: true, type: true } },
      batch: { select: { batchNumber: true, status: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });
}
