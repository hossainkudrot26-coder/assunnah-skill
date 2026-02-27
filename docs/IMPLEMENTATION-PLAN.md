# As-Sunnah Skill Development Institute — Implementation Plan

**Date:** February 26, 2026
**Project Path:** `~/Desktop/Assunnah Skill/assunnah-skill/`
**Stack:** Next.js 16 (App Router) + Prisma 7 + PostgreSQL 15 + NextAuth v5
**Language:** Bengali (বাংলা) UI + English code

---

## ⚠️ CRITICAL RULES — Read Before ANY Work

These rules are NON-NEGOTIABLE. Every task, every file, every line must comply.

### Stack-Specific Gotchas (WILL BREAK if ignored)

```
PRISMA 7:
- NO `datasourceUrl` in PrismaClient constructor
- NO `url` in schema.prisma datasource block
- Must use `@prisma/adapter-pg` + `pg.Pool`
- URL goes ONLY in `prisma.config.ts`
- Check `src/lib/db.ts` for existing pattern — COPY EXACTLY

NEXTAUTH v5:
- Installed as `next-auth@beta` (NOT `@5`)
- Middleware MUST have `export const runtime = "nodejs"`
- PrismaAdapter uses the adapter-based PrismaClient from db.ts
```

### Code Quality Rules

```
1. CSS Modules ONLY — no inline style={{}} in production code
2. Every .module.css MUST include [data-theme="dark"] rules
3. No `any` type — use proper interfaces/types
4. Zod validation on ALL form inputs (server-side)
5. Bengali text for ALL user-facing labels — verify accuracy
6. Every admin mutation: requireAdmin() guard first
7. Every mutation: try/catch with Bengali error message
8. Every mutation: revalidatePath() for affected routes
9. Build must pass: `npm run build` — zero errors
10. Read files FULLY before editing — never guess content
```

### File Patterns to Follow

```
Admin page CSS:    src/app/(admin)/admin/[module]/[module].module.css
Server actions:    src/lib/actions/[domain].ts
Shared components: src/shared/components/[Name].tsx
Auth guard:        import { requireAdmin } from "@/lib/auth-guard"
DB client:         import { prisma } from "@/lib/db"
```

---

## Sprint 1: Security & Foundation 🔴

**Priority:** CRITICAL — Do this first
**Estimated effort:** 3-4 hours
**Files to modify:** 6-8 files

---

### Task 1.1: Security Headers

**File:** `next.config.ts`
**What:** Add security headers that protect against XSS, clickjacking, MIME sniffing
**Why:** Currently 0 security headers — site is vulnerable

**Implementation:**

```typescript
// Add to next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

// In the config object, add:
async headers() {
  return [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ];
},
```

**Verify:** `npm run build` passes, then check headers with browser DevTools → Network tab.

---

### Task 1.2: Zod Validation Schemas

**Files to create:** `src/lib/validations/` directory with schema files
**Files to modify:** All server actions in `src/lib/actions/`
**What:** Add Zod validation to every server action that accepts user input
**Why:** Currently 0 validation — any input is accepted raw

**Step 1 — Install Zod (if not installed):**
```bash
npm install zod
```

**Step 2 — Create validation schemas:**

Create `src/lib/validations/course.ts`:
```typescript
import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3, "কোর্সের নাম কমপক্ষে ৩ অক্ষর হতে হবে").max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug শুধু lowercase letters, numbers, hyphens"),
  description: z.string().min(10, "বিবরণ কমপক্ষে ১০ অক্ষর").max(5000),
  shortDescription: z.string().max(500).optional(),
  duration: z.string().min(1, "সময়কাল আবশ্যক"),
  fee: z.number().min(0, "ফি ঋণাত্মক হতে পারে না"),
  discountFee: z.number().min(0).optional().nullable(),
  category: z.string().min(1, "ক্যাটেগরি নির্বাচন করুন"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  maxStudents: z.number().int().min(1).optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  instructors: z.array(z.object({
    name: z.string().min(2, "নাম আবশ্যক"),
    role: z.string().min(2, "পদবি আবশ্যক"),
    bio: z.string().max(500).optional(),
    initials: z.string().max(5).optional(),
  })).optional(),
});

export const updateCourseSchema = createCourseSchema.extend({
  id: z.string().cuid(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
```

Create similar schemas for: `blog.ts`, `event.ts`, `notice.ts`, `gallery.ts`, `testimonial.ts`, `team.ts`, `user.ts`, `application.ts`, `settings.ts`

**Step 3 — Apply in server actions:**

In each action function, add validation at the top:
```typescript
import { createCourseSchema } from "@/lib/validations/course";

export async function createCourse(rawInput: unknown) {
  await requireAdmin();
  
  const parsed = createCourseSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const input = parsed.data;
  
  // ... rest of function using validated `input`
}
```

**Pattern for ALL actions:** Parse first → use validated data → never use raw input directly.

**Verify:** Try submitting empty forms — should show Bengali validation errors.

---

### Task 1.3: Error Boundaries & Loading States

**Files to create:**
```
src/app/(website)/error.tsx
src/app/(website)/loading.tsx
src/app/(website)/not-found.tsx
src/app/(admin)/error.tsx
src/app/(admin)/loading.tsx
src/app/(hub)/error.tsx
src/app/(hub)/loading.tsx
src/app/not-found.tsx        (if not exists)
```

**error.tsx template:**
```tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h2>কিছু একটা সমস্যা হয়েছে</h2>
        <p>দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>
        <button onClick={reset}>আবার চেষ্টা করুন</button>
      </div>
    </div>
  );
}
```

**loading.tsx template:**
```tsx
export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p>লোড হচ্ছে...</p>
    </div>
  );
}
```

**not-found.tsx template:**
```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1>৪০৪</h1>
      <h2>পৃষ্ঠা খুঁজে পাওয়া যায়নি</h2>
      <p>আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি বিদ্যমান নেই বা সরানো হয়েছে।</p>
      <Link href="/">হোমপেজে ফিরে যান</Link>
    </div>
  );
}
```

**Each file needs a corresponding CSS module with dark mode rules.**

---

### Task 1.4: Fix Inline Styles → CSS Modules

**Files to modify:**
```
src/app/(admin)/admin/testimonials/page.tsx  (31 inline styles)
src/app/(admin)/admin/team/page.tsx          (29 inline styles)
src/app/(admin)/admin/users/page.tsx         (28 inline styles)
src/app/(admin)/admin/enrollments/page.tsx   (28 inline styles)
```

**For each file:**

1. Create a dedicated CSS module: `[module].module.css`
2. Extract every `style={{...}}` into a CSS class
3. Import the module and apply classes
4. Add `[data-theme="dark"]` variants for every class

**Example conversion:**
```tsx
// ❌ BEFORE (inline)
<div style={{ padding: "24px", background: "#fff", borderRadius: "12px" }}>

// ✅ AFTER (CSS Module)
<div className={styles.card}>
```

```css
/* testimonials.module.css */
.card {
  padding: 24px;
  background: var(--bg-primary, #fff);
  border-radius: 12px;
}

[data-theme="dark"] .card {
  background: var(--bg-primary-dark, #1a1a2e);
}
```

**Verify:** Visual check in both light and dark mode.

---

### Task 1.5: Fix `any` Types

**Current violations (8 instances):**

Search for: `as any`, `: any`, `value: any` in `src/lib/actions/` and `src/app/`

Replace each with proper typed interfaces. Examples:
```typescript
// ❌ BAD
const settings: Record<string, any> = {};

// ✅ GOOD
interface SettingValue {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  type: "string" | "number" | "boolean" | "json";
}
const settings: Record<string, SettingValue> = {};
```

---

## Sprint 2: Data Layer Optimization 🟡

**Priority:** HIGH
**Estimated effort:** 2-3 hours
**Files to modify:** All files in `src/lib/actions/`

---

### Task 2.1: Select Optimization (Prisma)

**What:** Currently all queries fetch entire objects. Add `select` to return only needed fields.
**Why:** Reduces database load and network transfer.

**Example:**
```typescript
// ❌ BEFORE — fetches ALL 20+ fields
const courses = await prisma.course.findMany({
  include: { instructors: true }
});

// ✅ AFTER — fetches only what the page needs
const courses = await prisma.course.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    status: true,
    fee: true,
    thumbnail: true,
    category: true,
    _count: { select: { applications: true } },
    instructors: {
      select: { name: true, role: true, initials: true },
      orderBy: { sortOrder: "asc" }
    }
  }
});
```

**Apply to:** Every `findMany` in list/grid pages. Keep `findUnique` with full data for detail/edit pages.

---

### Task 2.2: Pagination

**What:** Add cursor/offset pagination to all admin list pages
**Why:** Currently loads ALL records — will break with 100+ entries

**Server action pattern:**
```typescript
export async function getAdminCourses(page = 1, pageSize = 20, search?: string) {
  await requireAdmin();
  
  const where = search ? {
    OR: [
      { title: { contains: search, mode: "insensitive" as const } },
      { category: { contains: search, mode: "insensitive" as const } },
    ]
  } : {};
  
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: { /* ... */ }
    }),
    prisma.course.count({ where })
  ]);
  
  return {
    data: courses,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
```

**UI pagination component:**
Create `src/shared/components/Pagination.tsx` — reusable across all admin pages.

**Apply to:** courses, students, applications, blog, events, notices, gallery, testimonials, team, users, enrollments

---

### Task 2.3: Soft Deletes

**What:** Add `deletedAt DateTime?` field to important models
**Why:** Prevents accidental permanent data loss

**Models to add soft delete:**
```prisma
model User {
  // ... existing fields
  deletedAt DateTime?
}

model Course {
  deletedAt DateTime?
}

model Application {
  deletedAt DateTime?
}

model BlogPost {
  deletedAt DateTime?
}
```

**After schema change:**
```bash
npx prisma db push
```

**Update all delete actions:**
```typescript
// ❌ BEFORE
await prisma.course.delete({ where: { id } });

// ✅ AFTER (soft delete)
await prisma.course.update({
  where: { id },
  data: { deletedAt: new Date() }
});
```

**Update all queries to exclude deleted:**
```typescript
const courses = await prisma.course.findMany({
  where: { deletedAt: null }, // only active records
  // ...
});
```

---

### Task 2.4: Missing Dark Mode CSS

**Files missing dark mode rules:**

Check each `.module.css` file — any without `[data-theme="dark"]` needs it.

```css
/* Template — add to EVERY .module.css */
[data-theme="dark"] .container {
  background: var(--bg-dark, #0f0f23);
  color: var(--text-dark, #e0e0e0);
}

[data-theme="dark"] .card {
  background: var(--card-dark, #1a1a2e);
  border-color: var(--border-dark, #2d2d44);
}

/* ... for every class that has colors, backgrounds, borders */
```

---

## Sprint 3: Hardcoded Pages → Dynamic 🟡

**Priority:** HIGH
**Estimated effort:** 5-6 hours
**Files to modify/create:** ~15 files

---

### Task 3.1: About Page Dynamic

**Current:** `src/app/(website)/about/page.tsx` has 15 hardcoded arrays (team, timeline, values, facilities, stats)

**What to do:**

1. `TeamMember` model already exists in schema — use it
2. Create `SiteSetting` entries for: `about_timeline`, `about_values`, `about_facilities`, `about_stats`
3. Create server action `getAboutPageData()` in `src/lib/actions/data.ts`
4. Update page.tsx to fetch from DB, fallback to hardcoded if empty

**Server action:**
```typescript
export async function getAboutPageData() {
  const [team, settings] = await Promise.all([
    prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    }),
    getSettings(["about_timeline", "about_values", "about_facilities", "about_stats"])
  ]);
  
  return { team, ...settings };
}
```

---

### Task 3.2: FAQ Page → Admin CRUD

**Files to create:**
```
src/lib/actions/faq.ts              — CRUD actions
src/lib/validations/faq.ts          — Zod schema
src/app/(admin)/admin/faq/page.tsx  — Admin management page
src/app/(admin)/admin/faq/faq.module.css
```

**If FAQ model doesn't exist, add to schema:**
```prisma
model FAQ {
  id        String   @id @default(cuid())
  question  String
  answer    String   @db.Text
  category  String   @default("সাধারণ")
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([category, sortOrder])
}
```

**Update FAQ website page to fetch from DB.**

---

### Task 3.3: Scholarship Page → Settings

Store scholarship data in SiteSetting as JSON:
- `scholarship_types` — array of scholarship types
- `scholarship_eligibility` — eligibility criteria
- `scholarship_steps` — application steps
- `scholarship_stats` — numbers/percentages

**Admin:** Use existing Settings page, add a "বৃত্তি" section.

---

### Task 3.4: Admission Page → Dynamic

Same pattern as Scholarship — store in SiteSetting:
- `admission_requirements`
- `admission_steps`
- `admission_documents`
- `admission_dates`

---

### Task 3.5: Stories/Downloads → Dynamic

**Stories:** Create if model doesn't exist, or use BlogPost with `category: "story"`.
**Downloads:** Create a `Download` model or use SiteSetting for file links.

---

## Sprint 4: Premium Polish 🟢

**Priority:** MEDIUM
**Estimated effort:** 4-5 hours

---

### Task 4.1: Install Framer Motion + Add Animations

```bash
npm install framer-motion
```

**Create shared animation components:**

Create `src/shared/components/AnimatedSection.tsx`:
```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInSection({ children, delay = 0, className }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Apply to website pages:** Wrap sections in `FadeInSection`, card grids in `StaggerContainer` + `StaggerItem`.

**⚠️ Important:** Add `prefers-reduced-motion` respect:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

### Task 4.2: Fluid Typography + Design Tokens

**File:** `src/app/globals.css`

**Add/update CSS variables:**
```css
:root {
  /* Fluid Typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-3xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
  --text-hero: clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem);
  
  /* Spacing */
  --space-section: clamp(4rem, 3rem + 5vw, 8rem);
  
  /* Transitions */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --duration-normal: 400ms;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
}
```

**Update all existing CSS to use these variables** instead of fixed values.

---

### Task 4.3: Image Upload System

**Option A (Simple — Local/Public folder):**
Create API route `src/app/api/upload/route.ts` that saves to `public/uploads/`.

**Option B (Production — S3/R2):**
Use Cloudflare R2 or AWS S3 for persistent image storage.

**Minimum implementation:**
```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(request: NextRequest) {
  await requireAdmin();
  
  const formData = await request.formData();
  const file = formData.get("file") as File;
  
  if (!file) {
    return NextResponse.json({ error: "ফাইল পাওয়া যায়নি" }, { status: 400 });
  }
  
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "শুধু ছবি ফাইল আপলোড করুন" }, { status: 400 });
  }
  
  // Validate size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "ফাইল সাইজ ৫MB-এর বেশি হতে পারবে না" }, { status: 400 });
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadsDir, { recursive: true });
  
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
  const filepath = path.join(uploadsDir, filename);
  await writeFile(filepath, buffer);
  
  return NextResponse.json({ url: `/uploads/${filename}` });
}
```

**Add upload UI component** to Blog, Gallery, Team, and Course admin forms.

---

### Task 4.4: Rich Text Editor

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

Create `src/shared/components/RichTextEditor.tsx` — use for Blog content and Course descriptions.

---

### Task 4.5: Dashboard Enhancement

**File:** `src/app/(admin)/admin/page.tsx`

**Add:**
- Mini chart (enrollment trend last 30 days) — use a lightweight chart lib or CSS-only bars
- Recent activity feed (last 10 applications, messages, blog posts)
- Active batch overview (current ongoing batches with enrollment count)
- Quick action links (add course, add blog, view messages)
- Today's stats vs last 7 days comparison

---

## Sprint 5: Production Ready 🟢

**Priority:** MEDIUM
**Estimated effort:** 3-4 hours

---

### Task 5.1: Complete SEO Metadata

Every page must have:
```tsx
export const metadata: Metadata = {
  title: "পৃষ্ঠার নাম | আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট",
  description: "পৃষ্ঠার বিবরণ — ১৫০-১৬০ অক্ষর",
  openGraph: {
    title: "...",
    description: "...",
    type: "website",
    locale: "bn_BD",
  },
};
```

**Pages missing metadata:** Check each page.tsx and add where missing.

---

### Task 5.2: Suspense Boundaries

Wrap data-fetching sections in Suspense for streaming:
```tsx
import { Suspense } from "react";

export default function CoursesPage() {
  return (
    <>
      <PageHeader title="কোর্সসমূহ" />
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesGrid />
      </Suspense>
    </>
  );
}
```

---

### Task 5.3: next/image Optimization

Replace all `<img>` tags with Next.js `<Image>`:
```tsx
import Image from "next/image";

<Image
  src={course.thumbnail || "/images/placeholder.jpg"}
  alt={course.title}
  width={400}
  height={250}
  className={styles.thumbnail}
  placeholder="blur"
  blurDataURL="data:image/png;base64,..." // generate with plaiceholder
/>
```

---

### Task 5.4: Accessibility Audit

- All images: `alt` text
- All buttons: descriptive text or `aria-label`
- All forms: `<label>` linked to inputs
- All modals: focus trap + Escape to close
- Color contrast: minimum 4.5:1 ratio
- Heading hierarchy: h1 → h2 → h3 (no skipping)
- Skip to content link at top of page

---

## ✅ Completion Checklist

After all sprints, run this final check:

```
BUILD & DEPLOY:
☐ npm run build — zero errors
☐ npm audit — no high/critical vulnerabilities
☐ All pages render correctly
☐ Dark mode works on every page
☐ Mobile responsive on every page

SECURITY:
☐ Security headers present (check with securityheaders.com)
☐ All forms have Zod validation
☐ All admin routes have requireAdmin()
☐ No secrets in git history
☐ .env in .gitignore

DATA:
☐ No hardcoded content on any website page
☐ All admin entities have full CRUD
☐ Pagination on all list pages
☐ Soft deletes on important models

UI/UX:
☐ Loading states on all async operations
☐ Error boundaries on all route groups
☐ Empty states on all lists
☐ 404 page exists
☐ Animations are smooth (60fps)
☐ prefers-reduced-motion respected

SEO:
☐ Metadata on every page
☐ OpenGraph tags
☐ Proper heading hierarchy
☐ All images have alt text
```

---

*This plan was generated by JARVIS based on comprehensive audit against: project-architect, nextjs-fullstack, prisma, design-engineer, and cyber-defense skill checklists.*
