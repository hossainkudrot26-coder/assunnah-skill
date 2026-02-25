"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { blogPostSchema } from "@/lib/validations";
import type { BlogPostInput } from "@/lib/validations";

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
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

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
        authorId: session.user.id,
        publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, message: "পোস্ট তৈরি হয়েছে!" };
  } catch (error: any) {
    if (error?.issues) return { success: false, error: error.issues[0].message };
    return { success: false, error: "পোস্ট তৈরি করতে সমস্যা হয়েছে" };
  }
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");

  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "অননুমোদিত" };

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");

  return { success: true };
}

export async function getAllPosts(page: number = 1, limit: number = 20) {
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
