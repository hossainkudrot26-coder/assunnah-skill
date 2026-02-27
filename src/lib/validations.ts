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

// ──────────── COURSE ────────────

const syllabusModuleSchema = z.object({
  title: z.string().min(1, "মডিউলের শিরোনাম দিন"),
  topics: z.array(z.string()).default([]),
});

const instructorInputSchema = z.object({
  name: z.string().min(1, "প্রশিক্ষকের নাম দিন"),
  role: z.string().min(1, "ভূমিকা দিন"),
  bio: z.string().default(""),
  initials: z.string().default(""),
});

const courseFeeSchema = z.object({
  admission: z.string().min(1, "ভর্তি ফি দিন"),
  total: z.string().optional(),
  scholarship: z.string().optional(),
  includes: z.array(z.string()).optional(),
});

export const courseSchema = z.object({
  title: z.string().min(2, "কোর্সের নাম দিন (কমপক্ষে ২ অক্ষর)"),
  titleEn: z.string().optional(),
  slug: z.string().min(2, "স্লাগ দিন").regex(/^[a-z0-9-]+$/, "স্লাগে শুধু ইংরেজি ছোট হাতের অক্ষর, সংখ্যা ও হাইফেন ব্যবহার করুন"),
  shortDesc: z.string().min(10, "সংক্ষিপ্ত বিবরণ কমপক্ষে ১০ অক্ষরের হতে হবে"),
  fullDesc: z.string().min(20, "বিস্তারিত বিবরণ কমপক্ষে ২০ অক্ষরের হতে হবে"),
  duration: z.string().min(1, "সময়কাল দিন"),
  type: z.string().min(1, "ধরন নির্বাচন করুন"),
  category: z.string().optional(),
  iconName: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "সঠিক কালার কোড দিন (যেমন #1B8A50)").optional(),
  batchInfo: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"], { message: "স্ট্যাটাস নির্বাচন করুন" }),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  fee: courseFeeSchema.optional(),
  highlights: z.array(z.string()).optional(),
  syllabus: z.array(syllabusModuleSchema).optional(),
  instructors: z.array(instructorInputSchema).optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;

// ──────────── BATCH ────────────

export const batchSchema = z.object({
  courseId: z.string().min(1, "কোর্স নির্বাচন করুন"),
  batchNumber: z.number().int().min(1, "ব্যাচ নম্বর দিন"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.number().int().min(1, "ধারণক্ষমতা কমপক্ষে ১ হতে হবে").default(30),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"], { message: "স্ট্যাটাস নির্বাচন করুন" }),
});

export type BatchInput = z.infer<typeof batchSchema>;

// ──────────── TESTIMONIAL ────────────

export const testimonialSchema = z.object({
  name: z.string().min(2, "নাম দিন (কমপক্ষে ২ অক্ষর)"),
  initials: z.string().max(3).optional(),
  batch: z.string().min(1, "ব্যাচ তথ্য দিন"),
  story: z.string().min(20, "গল্প কমপক্ষে ২০ অক্ষরের হতে হবে"),
  achievement: z.string().min(2, "অর্জন লিখুন"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "সঠিক কালার কোড দিন").default("#1B8A50"),
  isVisible: z.boolean().default(true),
  course: z.string().optional(),
  currentRole: z.string().optional(),
  monthlyIncome: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ──────────── TEAM MEMBER ────────────

export const teamMemberSchema = z.object({
  name: z.string().min(2, "নাম দিন (কমপক্ষে ২ অক্ষর)"),
  nameBn: z.string().optional(),
  role: z.string().min(1, "ভূমিকা/পদবী দিন"),
  bio: z.string().optional(),
  image: z.string().url("সঠিক URL দিন").optional().or(z.literal("")),
  initials: z.string().max(3).optional(),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  phone: z.string().optional(),
  isVisible: z.boolean().default(true),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

// ──────────── EVENT ────────────

export const eventSchema = z.object({
  title: z.string().min(3, "শিরোনাম দিন"),
  description: z.string().min(1, "বিবরণ দিন"),
  date: z.string().min(1, "তারিখ দিন"),
  time: z.string().min(1, "সময় দিন"),
  location: z.string().min(1, "স্থান দিন"),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], { message: "স্ট্যাটাস নির্বাচন করুন" }),
  type: z.enum(["ADMISSION", "SEMINAR", "WORKSHOP", "CEREMONY", "EXAM"], { message: "ধরন নির্বাচন করুন" }),
  attendees: z.number().int().min(0).optional().nullable(),
  isPublished: z.boolean().default(true),
});

export type EventInput = z.infer<typeof eventSchema>;

// ──────────── GALLERY ────────────

export const gallerySchema = z.object({
  title: z.string().min(2, "শিরোনাম দিন"),
  titleBn: z.string().optional(),
  desc: z.string().optional(),
  image: z.string().min(1, "ছবি আবশ্যক"),
  category: z.string().min(1, "ক্যাটেগরি দিন"),
  span: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export type GalleryInput = z.infer<typeof gallerySchema>;

// ──────────── DOWNLOAD ────────────

export const downloadSchema = z.object({
  title: z.string().min(2, "শিরোনাম দিন"),
  description: z.string().min(1, "বিবরণ দিন"),
  fileUrl: z.string().optional(),
  fileType: z.string().default("PDF"),
  fileSize: z.string().optional(),
  category: z.enum(["GENERAL", "ADMISSION", "SYLLABUS"], { message: "ক্যাটেগরি নির্বাচন করুন" }),
  iconColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "সঠিক কালার কোড দিন").default("#1B8A50"),
  sortOrder: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

export type DownloadInput = z.infer<typeof downloadSchema>;

// ──────────── NOTICE ────────────

export const noticeSchema = z.object({
  title: z.string().min(3, "শিরোনাম দিন"),
  description: z.string().min(5, "বিবরণ দিন"),
  type: z.enum(["ADMISSION", "EXAM", "RESULT", "EVENT", "GENERAL"], { message: "ধরন নির্বাচন করুন" }),
  isImportant: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  link: z.string().optional(),
});

export type NoticeInput = z.infer<typeof noticeSchema>;

// ──────────── NOTIFICATION ────────────

export const notificationSchema = z.object({
  title: z.string().min(2, "শিরোনাম দিন"),
  message: z.string().min(5, "বার্তা দিন"),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  link: z.string().optional(),
});

export type NotificationInput = z.infer<typeof notificationSchema>;

// ──────────── HELPER: Format Zod Errors ────────────

export function formatZodError(error: z.ZodError): string {
  // Zod v4 uses 'issues' property
  return error.issues.map((issue) => issue.message).join(", ");
}

