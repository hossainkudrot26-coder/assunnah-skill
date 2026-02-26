"use server";

import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

type AuthorizedResult = {
  authorized: true;
  session: Session & { user: { id: string; name?: string | null; email?: string | null } };
};

type UnauthorizedResult = {
  authorized: false;
  error: string;
};

type GuardResult = AuthorizedResult | UnauthorizedResult;

/**
 * Require an authenticated admin user.
 * Returns the session on success, or an error object on failure.
 */
export async function requireAdmin(): Promise<GuardResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { authorized: false, error: "অননুমোদিত — লগইন করুন" };
  }
  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return { authorized: false, error: "অননুমোদিত — শুধুমাত্র অ্যাডমিন" };
  }
  return { authorized: true, session: session as AuthorizedResult["session"] };
}

/**
 * Require any authenticated user.
 */
export async function requireAuth(): Promise<GuardResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { authorized: false, error: "অননুমোদিত — লগইন করুন" };
  }
  return { authorized: true, session: session as AuthorizedResult["session"] };
}

/**
 * Require that the logged-in user is the owner of the resource.
 * Prevents users from editing other users' profiles.
 */
export async function requireOwner(targetUserId: string): Promise<GuardResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { authorized: false, error: "অননুমোদিত — লগইন করুন" };
  }
  if (session.user.id !== targetUserId) {
    return { authorized: false, error: "অননুমোদিত — এই রিসোর্সে আপনার অ্যাক্সেস নেই" };
  }
  return { authorized: true, session: session as AuthorizedResult["session"] };
}
