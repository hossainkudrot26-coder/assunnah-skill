"use server";

import prisma from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import type { ApplicationInput } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { sendApplicationNotification, sendStudentCredentials } from "@/lib/email";
import { requireAdmin, requireOwner } from "@/lib/auth-guard";
import { checkRateLimit, APPLICATION_LIMIT } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ──────────── SUBMIT APPLICATION (PUBLIC — anyone can apply) ────────────

export async function submitApplication(data: ApplicationInput) {
  try {
    const validated = applicationSchema.parse(data);
    const session = await auth();

    // Rate limit by phone
    const rl = checkRateLimit(`application:${validated.applicantPhone}`, APPLICATION_LIMIT);
    if (!rl.allowed) {
      return {
        success: false,
        error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে আবার চেষ্টা করুন।`,
      };
    }

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

    // Email notification to admin (non-blocking)
    const course = await prisma.course.findUnique({
      where: { id: validated.courseId },
      select: { title: true },
    });
    sendApplicationNotification({
      applicantName: validated.applicantName,
      applicantPhone: validated.applicantPhone,
      courseTitle: course?.title || "অজানা কোর্স",
    }).catch(() => { });

    return { success: true, message: "আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করবো।" };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return { success: false, error: (error as { issues: { message: string }[] }).issues[0].message };
    }
    return { success: false, error: "আবেদন জমা দিতে সমস্যা হয়েছে।" };
  }
}

// ──────────── GET ALL APPLICATIONS (ADMIN ONLY) ────────────

export async function getApplications(
  status?: string,
  page: number = 1,
  limit: number = 20
) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { applications: [], total: 0, pages: 0 };

  const skip = (page - 1) * limit;
  const where = status
    ? { status: status as "PENDING" | "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "ACCEPTED" | "REJECTED" | "WAITLISTED" }
    : {};

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

// ──────────── UPDATE APPLICATION STATUS (ADMIN ONLY) ────────────

export async function updateApplicationStatus(
  id: string,
  status: string,
  reviewNotes?: string
) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const validStatuses = ["PENDING", "UNDER_REVIEW", "INTERVIEW_SCHEDULED", "ACCEPTED", "REJECTED", "WAITLISTED"] as const;
  if (!validStatuses.includes(status as typeof validStatuses[number])) {
    return { success: false, error: "অবৈধ স্ট্যাটাস" };
  }

  try {
    await prisma.application.update({
      where: { id },
      data: {
        status: status as typeof validStatuses[number],
        reviewNotes: reviewNotes || undefined,
        reviewedBy: guard.session.user.id,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}

// ──────────── GET APPLICATION DETAIL (ADMIN ONLY) ────────────

export async function getApplicationDetail(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return null;

  return prisma.application.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, slug: true, duration: true, type: true } },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
}

// ──────────── ENROLL STUDENT (ADMIN ONLY) ────────────

export async function enrollStudent(applicationId: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { course: true },
  });

  if (!application) return { success: false, error: "আবেদন পাওয়া যায়নি" };
  if (application.status !== "ACCEPTED") return { success: false, error: "আবেদন গৃহীত হয়নি" };

  try {
    let userId = application.userId;
    let generatedPassword: string | null = null;
    let studentEmail: string | null = null;

    if (!userId) {
      // Only create user if they have an email — don't fabricate addresses
      const email = application.applicantEmail;
      if (!email) {
        return {
          success: false,
          error: "শিক্ষার্থীর ইমেইল নেই। প্রথমে ম্যানুয়ালি অ্যাকাউন্ট তৈরি করুন।",
        };
      }

      studentEmail = email;

      // Check if user with this email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Generate a random password for the new student
        generatedPassword = crypto.randomBytes(4).toString("hex"); // 8-char hex password
        const hashedPassword = await bcrypt.hash(generatedPassword, 12);

        const newUser = await prisma.user.create({
          data: {
            name: application.applicantName,
            email,
            phone: application.applicantPhone,
            password: hashedPassword,
            role: "STUDENT",
            gender: application.gender || undefined,
            dateOfBirth: application.dateOfBirth || undefined,
            nidNumber: application.nidNumber || undefined,
            address: application.address || undefined,
            guardianName: application.fatherName || undefined,
          },
        });
        userId = newUser.id;

        // Credentials sent via UI response + email — never log sensitive data

        // Send credentials via email (non-blocking, fails silently if SMTP not configured)
        sendStudentCredentials({
          studentName: application.applicantName,
          email,
          password: generatedPassword,
          courseTitle: application.course?.title || "কোর্স",
        }).catch(() => { });
      }

      // Link application to user
      await prisma.application.update({
        where: { id: applicationId },
        data: { userId },
      });
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId, courseId: application.courseId },
    });

    if (existingEnrollment) {
      return { success: false, error: "শিক্ষার্থী ইতিমধ্যে এই কোর্সে ভর্তি আছেন" };
    }

    // Find an active batch
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

    // Build success message — show credentials if new account was created
    let message = "শিক্ষার্থী সফলভাবে ভর্তি করা হয়েছে!";
    if (generatedPassword && studentEmail) {
      message = `ভর্তি সম্পন্ন! নতুন অ্যাকাউন্ট তৈরি হয়েছে।\n\n📧 ইমেইল: ${studentEmail}\n🔑 পাসওয়ার্ড: ${generatedPassword}\n\n⚠️ এই তথ্য শিক্ষার্থীকে জানিয়ে দিন।`;
    }

    return { success: true, message };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "শিক্ষার্থী ইতিমধ্যে ভর্তি আছেন" };
    }
    return { success: false, error: "ভর্তি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── GET ENROLLMENTS (ADMIN ONLY) ────────────

export async function getEnrollments(courseId?: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

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

// ──────────── UPDATE ENROLLMENT STATUS (ADMIN ONLY) ────────────

export async function updateEnrollmentStatus(id: string, status: string, progress?: number) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const validStatuses = ["ENROLLED", "IN_PROGRESS", "COMPLETED", "DROPPED"] as const;
  if (!validStatuses.includes(status as typeof validStatuses[number])) {
    return { success: false, error: "অবৈধ স্ট্যাটাস" };
  }

  try {
    await prisma.enrollment.update({
      where: { id },
      data: {
        status: status as typeof validStatuses[number],
        progress: progress !== undefined ? progress : undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}

// ──────────── GET USER APPLICATIONS (OWNER ONLY) ────────────

export async function getUserApplications(userId: string) {
  const guard = await requireOwner(userId);
  if (!guard.authorized) return [];

  return prisma.application.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, slug: true, duration: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ──────────── GET USER ENROLLMENTS (OWNER ONLY) ────────────

export async function getUserEnrollments(userId: string) {
  const guard = await requireOwner(userId);
  if (!guard.authorized) return [];

  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, slug: true, duration: true, type: true } },
      batch: { select: { batchNumber: true, status: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });
}
