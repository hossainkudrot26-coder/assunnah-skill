import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  contactSchema,
  applicationSchema,
  blogPostSchema,
} from "@/lib/validations";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("accepts valid credentials", () => {
      const result = loginSchema.safeParse({
        email: "admin@assunnahskill.org",
        password: "admin123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty email", () => {
      const result = loginSchema.safeParse({ email: "", password: "123456" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email format", () => {
      const result = loginSchema.safeParse({ email: "not-email", password: "123456" });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = loginSchema.safeParse({ email: "a@b.com", password: "123" });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    const validData = {
      name: "মোহাম্মদ আহমেদ",
      email: "ahmed@gmail.com",
      phone: "01712345678",
      password: "pass123",
      confirmPassword: "pass123",
      gender: "MALE" as const,
    };

    it("accepts valid registration", () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        ...validData,
        confirmPassword: "different",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid Bangladeshi phone", () => {
      const result = registerSchema.safeParse({
        ...validData,
        phone: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("accepts +880 format phone", () => {
      const result = registerSchema.safeParse({
        ...validData,
        phone: "+8801712345678",
      });
      expect(result.success).toBe(true);
    });

    it("rejects name shorter than 2 chars", () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: "আ",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("contactSchema", () => {
    it("accepts valid contact form", () => {
      const result = contactSchema.safeParse({
        name: "আব্দুল্লাহ",
        phone: "01812345678",
        message: "আমি কোর্স সম্পর্কে জানতে চাই",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short message", () => {
      const result = contactSchema.safeParse({
        name: "টেস্ট",
        phone: "01812345678",
        message: "হ্যালো",
      });
      expect(result.success).toBe(false);
    });

    it("allows empty email", () => {
      const result = contactSchema.safeParse({
        name: "টেস্ট",
        phone: "01812345678",
        message: "এটি একটি দীর্ঘ বার্তা",
        email: "",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email when provided", () => {
      const result = contactSchema.safeParse({
        name: "টেস্ট",
        phone: "01812345678",
        message: "এটি একটি দীর্ঘ বার্তা",
        email: "not-valid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("applicationSchema", () => {
    it("accepts valid application", () => {
      const result = applicationSchema.safeParse({
        courseId: "clx123abc",
        applicantName: "রহিম উদ্দিন",
        applicantPhone: "01912345678",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing courseId", () => {
      const result = applicationSchema.safeParse({
        courseId: "",
        applicantName: "রহিম",
        applicantPhone: "01912345678",
      });
      expect(result.success).toBe(false);
    });

    it("allows optional fields", () => {
      const result = applicationSchema.safeParse({
        courseId: "clx123abc",
        applicantName: "রহিম উদ্দিন",
        applicantPhone: "01912345678",
        fatherName: "করিম উদ্দিন",
        education: "SSC",
        motivation: "আমি দক্ষ হতে চাই",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("blogPostSchema", () => {
    it("accepts valid blog post", () => {
      const result = blogPostSchema.safeParse({
        title: "টেস্ট পোস্ট",
        slug: "test-post",
        content: "এটি একটি টেস্ট ব্লগ পোস্ট।",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short title", () => {
      const result = blogPostSchema.safeParse({
        title: "ab",
        slug: "ab",
        content: "এটি একটি টেস্ট।",
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid status values", () => {
      const result = blogPostSchema.safeParse({
        title: "টেস্ট পোস্ট",
        slug: "test-post",
        content: "এটি একটি টেস্ট।",
        status: "PUBLISHED",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = blogPostSchema.safeParse({
        title: "টেস্ট পোস্ট",
        slug: "test-post",
        content: "এটি একটি টেস্ট।",
        status: "INVALID",
      });
      expect(result.success).toBe(false);
    });
  });
});
