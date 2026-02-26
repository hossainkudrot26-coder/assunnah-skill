"use server";

import prisma from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import type { ContactInput } from "@/lib/validations";
import { sendContactNotification } from "@/lib/email";
import { requireAdmin } from "@/lib/auth-guard";
import { checkRateLimit, CONTACT_LIMIT } from "@/lib/rate-limit";

// ──────────── SUBMIT CONTACT FORM (PUBLIC) ────────────

export async function submitContactForm(data: ContactInput) {
  try {
    const validated = contactSchema.parse(data);

    // Rate limit by phone number
    const rl = checkRateLimit(`contact:${validated.phone}`, CONTACT_LIMIT);
    if (!rl.allowed) {
      return {
        success: false,
        error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে আবার চেষ্টা করুন।`,
      };
    }

    await prisma.contactMessage.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        subject: validated.subject || null,
        message: validated.message,
        status: "UNREAD",
      },
    });

    // Send email notification (non-blocking)
    sendContactNotification({
      name: validated.name,
      phone: validated.phone,
      email: validated.email || undefined,
      subject: validated.subject || undefined,
      message: validated.message,
    }).catch(() => { });

    return { success: true, message: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে!" };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return { success: false, error: (error as { issues: { message: string }[] }).issues[0].message };
    }
    return { success: false, error: "বার্তা পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" };
  }
}

// ──────────── GET CONTACT MESSAGES (ADMIN ONLY) ────────────

export async function getContactMessages(page: number = 1, limit: number = 20) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { messages: [], total: 0, pages: 0 };

  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count(),
  ]);

  return { messages, total, pages: Math.ceil(total / limit) };
}

// ──────────── MARK MESSAGE AS READ (ADMIN ONLY) ────────────

export async function markMessageAsRead(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: "READ" },
    });
    return { success: true };
  } catch {
    return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
  }
}
