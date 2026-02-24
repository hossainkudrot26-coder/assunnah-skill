"use server";

import prisma from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import type { ContactInput } from "@/lib/validations";

export async function submitContactForm(data: ContactInput) {
  try {
    const validated = contactSchema.parse(data);

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

    return { success: true, message: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে!" };
  } catch (error: any) {
    if (error?.issues) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "বার্তা পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" };
  }
}

export async function getContactMessages(page: number = 1, limit: number = 20) {
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

export async function markMessageAsRead(id: string) {
  await prisma.contactMessage.update({
    where: { id },
    data: { status: "READ" },
  });
}
