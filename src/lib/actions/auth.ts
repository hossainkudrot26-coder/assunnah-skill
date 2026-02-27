"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import { loginSchema, registerSchema } from "@/lib/validations";
import type { LoginInput, RegisterInput } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email";
import { requireOwner } from "@/lib/auth-guard";
import { checkRateLimit, LOGIN_LIMIT, REGISTER_LIMIT, RESET_LIMIT } from "@/lib/rate-limit";

// ──────────── LOGIN ────────────

export async function loginAction(data: LoginInput) {
  try {
    const validated = loginSchema.parse(data);

    // Rate limit by email
    const rl = checkRateLimit(`login:${validated.email}`, LOGIN_LIMIT);
    if (!rl.allowed) {
      return {
        success: false,
        error: `অনেকবার চেষ্টা করেছেন। ${rl.retryAfterSeconds} সেকেন্ড পরে আবার চেষ্টা করুন।`,
      };
    }

    await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return { success: true };
  } catch (error: unknown) {
    // NextAuth redirect error — actually means success
    if (error instanceof Error && error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    if (error && typeof error === "object" && "type" in error && (error as { type: string }).type === "CredentialsSignin") {
      return { success: false, error: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে" };
    }
    return { success: false, error: "লগইন করতে সমস্যা হয়েছে" };
  }
}

// ──────────── REGISTER ────────────

export async function registerAction(data: RegisterInput) {
  try {
    const validated = registerSchema.parse(data);

    // Rate limit by phone
    const rl = checkRateLimit(`register:${validated.phone}`, REGISTER_LIMIT);
    if (!rl.allowed) {
      return {
        success: false,
        error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে আবার চেষ্টা করুন।`,
      };
    }

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

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        password: hashedPassword,
        gender: validated.gender,
        role: "STUDENT",
      },
    });

    return { success: true, message: "অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।" };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return { success: false, error: (error as { issues: { message: string }[] }).issues[0].message };
    }
    return { success: false, error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" };
  }
}

// ──────────── FORGOT PASSWORD ────────────

export async function requestPasswordReset(email: string) {
  if (!email || typeof email !== "string") {
    return { success: false, error: "ইমেইল দিন" };
  }

  const rl = checkRateLimit(`reset:${email}`, RESET_LIMIT);
  if (!rl.allowed) {
    return {
      success: false,
      error: `অনুগ্রহ করে ${rl.retryAfterSeconds} সেকেন্ড পরে আবার চেষ্টা করুন।`,
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true, message: "নির্দেশনা পাঠানো হয়েছে (যদি অ্যাকাউন্ট থাকে)।" };
  }

  // Generate secure reset token
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete any existing tokens for this identifier
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Store hashed token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires: expiresAt,
    },
  });

  // Send reset email (non-blocking)
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  sendPasswordResetEmail({ email, resetUrl, userName: user.name || "" }).catch(() => { });

  return { success: true, message: "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।" };
}

// ──────────── RESET PASSWORD (with token) ────────────

export async function resetPassword(email: string, token: string, newPassword: string) {
  if (!email || !token || !newPassword) {
    return { success: false, error: "অনুগ্রহ করে সকল তথ্য দিন" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" };
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find valid token
  const storedToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
      token: hashedToken,
      expires: { gt: new Date() },
    },
  });

  if (!storedToken) {
    return { success: false, error: "রিসেট লিংক মেয়াদোত্তীর্ণ বা অবৈধ। আবার চেষ্টা করুন।" };
  }

  // Update password
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { password: hashed },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier: email },
    }),
  ]);

  return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করুন।" };
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
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
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
