"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

// ──────────── PUBLIC ────────────

export async function getPublishedEvents() {
  return prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "desc" },
  });
}

// ──────────── ADMIN ────────────

export async function getAdminEvents() {
  const guard = await requireAdmin();
  if (!guard.authorized) return [];

  return prisma.event.findMany({
    orderBy: { date: "desc" },
  });
}

interface EventInput {
  title: string;
  description: string;
  date: string; // ISO string
  time: string;
  location: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  type: "ADMISSION" | "SEMINAR" | "WORKSHOP" | "CEREMONY" | "EXAM";
  attendees?: number;
  isPublished?: boolean;
}

export async function createEvent(data: EventInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        time: data.time,
        location: data.location,
        status: data.status,
        type: data.type,
        attendees: data.attendees || null,
        isPublished: data.isPublished ?? true,
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "ইভেন্ট তৈরি করতে সমস্যা হয়েছে" };
  }
}

export async function updateEvent(id: string, data: Partial<EventInput>) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        time: data.time,
        location: data.location,
        status: data.status,
        type: data.type,
        attendees: data.attendees,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
  }
}

export async function deleteEvent(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.event.delete({ where: { id } });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "মুছতে সমস্যা হয়েছে" };
  }
}
