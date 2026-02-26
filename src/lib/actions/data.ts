"use server";

import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

// ──────────── COURSES (PUBLIC) ────────────

export async function getPublishedCourses() {
  return prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      fee: true,
      highlights: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      fee: true,
      syllabus: { orderBy: { sortOrder: "asc" } },
      highlights: { orderBy: { sortOrder: "asc" } },
      batches: {
        where: { status: { in: ["UPCOMING", "ONGOING"] } },
        orderBy: { batchNumber: "desc" },
        take: 1,
      },
    },
  });
}

// ──────────── GALLERY (PUBLIC) ────────────

export async function getGalleryItems(category?: string) {
  const where = category
    ? { isVisible: true, category }
    : { isVisible: true };

  return prisma.galleryItem.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });
}

// ──────────── TESTIMONIALS (PUBLIC) ────────────

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

// ──────────── SITE SETTINGS ────────────

export async function getSetting(key: string) {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  if (!setting) return null;

  switch (setting.type) {
    case "json":
      return JSON.parse(setting.value);
    case "boolean":
      return setting.value === "true";
    case "number":
      return Number(setting.value);
    default:
      return setting.value;
  }
}

// ADMIN ONLY — modifies site configuration
export async function setSetting(key: string, value: any, type: string = "string") {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  const stringValue = type === "json" ? JSON.stringify(value) : String(value);

  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: stringValue, type },
    create: { key, value: stringValue, type },
  });

  return { success: true };
}

// ──────────── DASHBOARD STATS (ADMIN ONLY) ────────────

export async function getDashboardStats() {
  const guard = await requireAdmin();
  if (!guard.authorized) {
    return {
      totalStudents: 0,
      totalApplications: 0,
      pendingApplications: 0,
      totalCourses: 0,
      totalMessages: 0,
      unreadMessages: 0,
    };
  }

  const [
    totalStudents,
    totalApplications,
    pendingApplications,
    totalCourses,
    totalMessages,
    unreadMessages,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
  ]);

  return {
    totalStudents,
    totalApplications,
    pendingApplications,
    totalCourses,
    totalMessages,
    unreadMessages,
  };
}
