"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import { loginSchema, registerSchema } from "@/lib/validations";
import type { LoginInput, RegisterInput } from "@/lib/validations";
import { requireOwner } from "@/lib/auth-guard";

export async function loginAction(data: LoginInput) {
  try {
    const validated = loginSchema.parse(data);

    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return { success: true };
  } catch (error: any) {
    if (error?.type === "CredentialsSignin") {
      return { success: false, error: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে" };
    }
    // NextAuth redirect error — actually means success
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error; // let Next.js handle the redirect
    }
    return { success: false, error: "লগইন করতে সমস্যা হয়েছে" };
  }
}

export async function registerAction(data: RegisterInput) {
  try {
    const validated = registerSchema.parse(data);

    // Check existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existingEmail) {
      return { success: false, error: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে" };
    }

    // Check existing phone
    const existingPhone = await prisma.user.findUnique({
      where: { phone: validated.phone },
    });
    if (existingPhone) {
      return { success: false, error: "এই নম্বর দিয়ে আগেই অ্যাকাউন্ট আছে" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create user
    await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        password: hashedPassword,
        gender: validated.gender as any,
        role: "STUDENT",
      },
    });

    return { success: true, message: "অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।" };
  } catch (error: any) {
    if (error?.issues) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── PROFILE UPDATE (OWNER ONLY) ────────────

export async function updateProfile(userId: string, data: { name: string; phone?: string }) {
  const guard = await requireOwner(userId);
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    if (!data.name || data.name.length < 2) {
      return { success: false, error: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone || undefined,
      },
    });

    return { success: true, message: "প্রোফাইল আপডেট হয়েছে!" };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "এই ফোন নম্বর ইতিমধ্যে ব্যবহৃত" };
    }
    return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
  }
}

// ──────────── CHANGE PASSWORD (OWNER ONLY) ────────────

export async function changePassword(userId: string, data: { currentPassword: string; newPassword: string }) {
  const guard = await requireOwner(userId);
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    if (!data.newPassword || data.newPassword.length < 6) {
      return { success: false, error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      return { success: false, error: "ব্যবহারকারী পাওয়া যায়নি" };
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "বর্তমান পাসওয়ার্ড ভুল" };
    }

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { success: true, message: "পাসওয়ার্ড পরিবর্তন হয়েছে!" };
  } catch {
    return { success: false, error: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে" };
  }
}

// ──────────── GET PROFILE DATA (OWNER ONLY) ────────────

export async function getProfileData(userId: string) {
  const guard = await requireOwner(userId);
  if (!guard.authorized) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      gender: true,
      dateOfBirth: true,
      address: true,
      createdAt: true,
    },
  });
}
