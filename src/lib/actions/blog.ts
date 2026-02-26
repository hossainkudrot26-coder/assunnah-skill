"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { blogPostSchema } from "@/lib/validations";
import type { BlogPostInput } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth-guard";

// ──────────── PUBLIC ────────────

export async function getPublishedPosts(page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: { author: { select: { name: true, image: true } } },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { name: true, image: true } } },
  });
}

export async function getFeaturedPost() {
  return prisma.blogPost.findFirst({
    where: { status: "PUBLISHED", isFeatured: true },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { publishedAt: "desc" },
  });
}

// ──────────── ADMIN ────────────

export async function createBlogPost(data: BlogPostInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    const validated = blogPostSchema.parse(data);

    const existing = await prisma.blogPost.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return { success: false, error: "এই স্লাগ দিয়ে পোস্ট আছে" };
    }

    await prisma.blogPost.create({
      data: {
        ...validated,
        tags: validated.tags || [],
        authorId: guard.session.user.id,
        publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, message: "পোস্ট তৈরি হয়েছে!" };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "এই slug ইতিমধ্যে ব্যবহৃত হয়েছে" };
    }
    return { success: false, error: "ব্লগ পোস্ট তৈরি করতে সমস্যা হয়েছে" };
  }
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    // Only set publishedAt on first publish — preserve existing date
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
    const shouldSetPublishedAt =
      data.status === "PUBLISHED" && !existing?.publishedAt;

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: shouldSetPublishedAt ? new Date() : undefined,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch {
    return { success: false, error: "আপডেট করতে সমস্যা হয়েছে" };
  }
}

export async function deleteBlogPost(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { success: false, error: guard.error };

  try {
    await prisma.blogPost.delete({ where: { id } });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch {
    return { success: false, error: "মুছতে সমস্যা হয়েছে" };
  }
}

export async function getAllPosts(page: number = 1, limit: number = 20) {
  const guard = await requireAdmin();
  if (!guard.authorized) return { posts: [], total: 0, pages: 0 };

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count(),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}
