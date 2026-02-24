"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import { loginSchema, registerSchema } from "@/lib/validations";
import type { LoginInput, RegisterInput } from "@/lib/validations";

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
