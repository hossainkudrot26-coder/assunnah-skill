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
