"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { eventSchema, formatZodError, type EventInput } from "@/lib/validations";
import { ZodError } from "zod";

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



export async function createEvent(data: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const validated = eventSchema.parse(data);
    await prisma.event.create({
      data: {
        title: validated.title,
        description: validated.description,
        date: new Date(validated.date),
        time: validated.time,
        location: validated.location,
        status: validated.status,
        type: validated.type,
        attendees: validated.attendees || null,
        isPublished: validated.isPublished ?? true,
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) return { success: false, error: formatZodError(error) };
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

export async function toggleEventPublish(id: string, isPublished: boolean) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.event.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}
