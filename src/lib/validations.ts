import { z } from "zod";

// ──────────── AUTH ────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "ইমেইল দিন")
    .email("সঠিক ইমেইল দিন"),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  email: z
    .string()
    .min(1, "ইমেইল দিন")
    .email("সঠিক ইমেইল দিন"),
  phone: z
    .string()
    .min(11, "সঠিক ফোন নম্বর দিন")
    .regex(/^(\+?880|0)1[3-9]\d{8}$/, "সঠিক বাংলাদেশি নম্বর দিন"),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  confirmPassword: z
    .string(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

// ──────────── CONTACT ────────────

export const contactSchema = z.object({
  name: z.string().min(2, "নাম দিন"),
  phone: z.string().min(11, "ফোন নম্বর দিন"),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(10, "কমপক্ষে ১০ অক্ষরের বার্তা লিখুন"),
});

// ──────────── APPLICATION ────────────

export const applicationSchema = z.object({
  courseId: z.string().min(1, "কোর্স নির্বাচন করুন"),
  applicantName: z.string().min(2, "নাম দিন"),
  applicantPhone: z.string().min(11, "ফোন নম্বর দিন"),
  applicantEmail: z.string().email().optional().or(z.literal("")),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  nidNumber: z.string().optional(),
  address: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  motivation: z.string().optional(),
});

// ──────────── BLOG POST ────────────

export const blogPostSchema = z.object({
  title: z.string().min(3, "শিরোনাম দিন"),
  slug: z.string().min(3, "স্লাগ দিন"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "বিষয়বস্তু লিখুন"),
  image: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
