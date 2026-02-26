import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { auth } from "@/lib/auth";

// ──────────── CONFIG ────────────
// UPLOAD_DIR env controls where files are stored.
// In Docker, mount a volume to this path to persist uploads across restarts.
// Default: ./public/uploads (development)
// Docker example: UPLOAD_DIR=/data/uploads + docker volume mount
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

// URL prefix for serving uploaded files.
// If using UPLOAD_DIR outside public/, configure a reverse proxy or static file route.
const UPLOAD_URL_PREFIX = process.env.UPLOAD_URL_PREFIX || "/uploads";

// ──────────── SECURITY ────────────
// Allowed MIME types → corresponding safe file extensions
const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  // ── Auth: admin only ──
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
  }
  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "অননুমোদিত — শুধুমাত্র অ্যাডমিন" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ফাইল পাওয়া যায়নি" }, { status: 400 });
    }

    // ── Validate MIME type ──
    const safeExt = ALLOWED_EXTENSIONS[file.type];
    if (!safeExt) {
      return NextResponse.json(
        { error: "শুধুমাত্র ছবি (JPG, PNG, WebP, GIF) আপলোড করা যাবে" },
        { status: 400 }
      );
    }

    // ── Validate file size ──
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "ফাইল সাইজ ৫MB-এর বেশি হতে পারবে না" },
        { status: 400 }
      );
    }

    // ── Double-check extension from filename ──
    // Use path.extname() for safe parsing (avoids path traversal via crafted filenames)
    const rawExt = path.extname(file.name).toLowerCase();
    const allowedExtValues = Object.values(ALLOWED_EXTENSIONS);
    if (rawExt && !allowedExtValues.includes(rawExt)) {
      return NextResponse.json(
        { error: `অনুমোদিত এক্সটেনশন: ${allowedExtValues.join(", ")}` },
        { status: 400 }
      );
    }

    // ── Generate safe filename ──
    // Use crypto random bytes — never trust user-provided filenames
    const uniqueId = crypto.randomBytes(12).toString("hex");
    const filename = `${Date.now()}-${uniqueId}${safeExt}`;

    // ── Ensure upload directory exists ──
    await mkdir(UPLOAD_DIR, { recursive: true });

    // ── Resolve and validate final path (prevent directory traversal) ──
    const filepath = path.resolve(UPLOAD_DIR, filename);
    if (!filepath.startsWith(path.resolve(UPLOAD_DIR))) {
      return NextResponse.json({ error: "অবৈধ ফাইল পাথ" }, { status: 400 });
    }

    // ── Write file ──
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const url = `${UPLOAD_URL_PREFIX}/${filename}`;

    return NextResponse.json({ success: true, url, filename });
  } catch {
    return NextResponse.json({ error: "আপলোড করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
