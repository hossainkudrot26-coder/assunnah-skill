"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@prisma/client";
import { useRouter } from "next/navigation";
import { getAllPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/actions/blog";
import styles from "./blog-admin.module.css";

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    tags: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    isFeatured: false,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const data = await getAllPosts(1, 50);
    setPosts(data.posts);
    setLoading(false);
  }

  function resetForm() {
    setForm({ title: "", slug: "", excerpt: "", content: "", image: "", category: "", tags: "", status: "DRAFT", isFeatured: false });
    setEditingPost(null);
    setError("");
    setSuccess("");
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      image: post.image || "",
      category: post.category || "",
      tags: (post.tags || []).join(", "),
      status: post.status as "DRAFT" | "PUBLISHED",
      isFeatured: post.isFeatured,
    });
    setEditingPost(post);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0980-\u09FF-]/g, "").slice(0, 60);
  }

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !editingPost) {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
      image: form.image || undefined,
      category: form.category || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: form.status as "DRAFT" | "PUBLISHED",
      isFeatured: form.isFeatured,
    };

    try {
      if (editingPost) {
        const result = await updateBlogPost(editingPost.id, payload);
        if (result.success) {
          setSuccess("পোস্ট আপডেট হয়েছে!");
          await loadPosts();
          setTimeout(() => { setShowForm(false); resetForm(); }, 1500);
        } else {
          setError(result.error || "সমস্যা হয়েছে");
        }
      } else {
        const result = await createBlogPost(payload);
        if (result.success) {
          setSuccess("পোস্ট তৈরি হয়েছে!");
          await loadPosts();
          setTimeout(() => { setShowForm(false); resetForm(); }, 1500);
        } else {
          setError(result.error || "সমস্যা হয়েছে");
        }
      }
    } catch {
      setError("সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("এই পোস্ট মুছে ফেলতে চান?")) return;
    await deleteBlogPost(id);
    await loadPosts();
  }

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.blogAdmin}>
      {!showForm ? (
        <>
          <div className={styles.header}>
            <h2>ব্লগ পোস্ট</h2>
            <button className={styles.createBtn} onClick={openCreate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              নতুন পোস্ট
            </button>
          </div>

          {posts.length === 0 ? (
            <div className={styles.empty}><p>কোনো পোস্ট নেই</p></div>
          ) : (
            <div className={styles.postsList}>
              {posts.map((p) => (
                <div key={p.id} className={styles.postCard}>
                  <div className={styles.postTop}>
                    <div>
                      <strong>{p.title}</strong>
                      {p.category && <span className={styles.category}>{p.category}</span>}
                    </div>
                    <div className={styles.postActions}>
                      <span className={`${styles.statusBadge} ${p.status === "PUBLISHED" ? styles.published : styles.draft}`}>
                        {p.status === "PUBLISHED" ? "প্রকাশিত" : "ড্রাফট"}
                      </span>
                    </div>
                  </div>
                  {p.excerpt && <p className={styles.excerpt}>{p.excerpt}</p>}
                  <div className={styles.postBottom}>
                    <span className={styles.date}>
                      {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("bn-BD") : "—"}
                    </span>
                    <div className={styles.postBtns}>
                      <button onClick={() => openEdit(p)} className={styles.editBtn}>সম্পাদনা</button>
                      <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>মুছুন</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.header}>
            <h2>{editingPost ? "পোস্ট সম্পাদনা" : "নতুন পোস্ট"}</h2>
            <button className={styles.backBtn} onClick={() => { setShowForm(false); resetForm(); }}>
              বাতিল করুন
            </button>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}
          {success && <div className={styles.successMsg}>{success}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>শিরোনাম *</label>
                <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>স্লাগ *</label>
                <input type="text" value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>সারসংক্ষেপ</label>
              <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} placeholder="সংক্ষিপ্ত বিবরণ..." />
            </div>

            <div className={styles.formGroup}>
              <label>বিষয়বস্তু *</label>
              <textarea value={form.content} onChange={(e) => update("content", e.target.value)} rows={12} placeholder="পোস্টের বিষয়বস্তু লিখুন..." required />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>ছবির URL</label>
                <input type="url" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label>ক্যাটাগরি</label>
                <input type="text" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="ভর্তি, অর্জন..." />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>ট্যাগ (কমা দিয়ে)</label>
                <input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="ভর্তি, ব্যাচ ১৬" />
              </div>
              <div className={styles.formGroup}>
                <label>স্ট্যাটাস</label>
                <select value={form.status} onChange={(e) => update("status", e.target.value)}>
                  <option value="DRAFT">ড্রাফট</option>
                  <option value="PUBLISHED">প্রকাশিত</option>
                </select>
              </div>
            </div>

            <label className={styles.checkbox}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} />
              ফিচার্ড পোস্ট
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={saving}>
                {saving ? "সেভ হচ্ছে..." : editingPost ? "আপডেট করুন" : "পোস্ট তৈরি করুন"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
