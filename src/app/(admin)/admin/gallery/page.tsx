"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  getAdminGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryVisibility,
} from "@/lib/actions/gallery";
import styles from "./gallery-admin.module.css";

const categoryOptions = ["ক্লাসরুম", "ইভেন্ট", "প্রতিষ্ঠান", "ক্যাম্পাস", "প্রশিক্ষণ", "অর্জন"];

interface GalleryForm {
  id?: string;
  title: string;
  titleBn: string;
  desc: string;
  image: string;
  category: string;
  span: string;
  sortOrder: number;
  isVisible: boolean;
}

const emptyForm: GalleryForm = {
  title: "",
  titleBn: "",
  desc: "",
  image: "",
  category: "",
  span: "",
  sortOrder: 0,
  isVisible: true,
};

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("ALL");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    const data = await getAdminGalleryItems();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const showToast = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Upload image
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        setError(data.error || "আপলোড ব্যর্থ");
      }
    } catch {
      setError("আপলোড করতে সমস্যা হয়েছে");
    }
    setUploading(false);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, sortOrder: items.length });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      title: item.title,
      titleBn: item.titleBn || "",
      desc: item.desc || "",
      image: item.image,
      category: item.category,
      span: item.span || "",
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.image || !form.category) {
      setError("শিরোনাম, ছবি ও ক্যাটাগরি আবশ্যক");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      titleBn: form.titleBn || undefined,
      desc: form.desc || undefined,
      image: form.image,
      category: form.category,
      span: form.span || undefined,
      sortOrder: form.sortOrder,
      isVisible: form.isVisible,
    };

    let result;
    if (form.id) {
      result = await updateGalleryItem(form.id, payload);
    } else {
      result = await createGalleryItem(payload);
    }

    if (result.success) {
      setShowModal(false);
      showToast("success", form.id ? "আপডেট হয়েছে!" : "যোগ করা হয়েছে!");
      await loadItems();
    } else {
      setError(result.error || "সমস্যা হয়েছে");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteGalleryItem(deleteId);
    if (result.success) {
      setDeleteId(null);
      showToast("success", "মুছে ফেলা হয়েছে!");
      await loadItems();
    }
  };

  const handleToggleVisible = async (id: string, current: boolean) => {
    await toggleGalleryVisibility(id, !current);
    await loadItems();
  };

  // Get unique categories
  const categories = ["ALL", ...new Set(items.map((i) => i.category))];
  const filtered = filterCat === "ALL" ? items : items.filter((i) => i.category === filterCat);

  if (loading) return <p style={{ color: "var(--color-neutral-500)" }}>লোড হচ্ছে...</p>;

  return (
    <div className={styles.page}>
      {/* Toast */}
      {message && (
        <div className={`${styles.toast} ${message.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>গ্যালারি ব্যবস্থাপনা</h2>
          <span className={styles.count}>{items.length} টি ছবি</span>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>+ ছবি যোগ করুন</button>
      </div>

      {/* Category Filter */}
      <div className={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filterCat === cat ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat === "ALL" ? "সব" : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🖼️</div>
          <p>কোনো ছবি পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((item: any) => (
            <div key={item.id} className={`${styles.gridCard} ${!item.isVisible ? styles.gridCardHidden : ""}`}>
              <div className={styles.imageWrap}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={200}
                  className={styles.image}
                  style={{ objectFit: "cover" }}
                />
                {!item.isVisible && <div className={styles.hiddenOverlay}>লুকানো</div>}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTitle}>{item.title}</div>
                <div className={styles.cardMeta}>
                  <span className={styles.catBadge}>{item.category}</span>
                  {item.span && <span className={styles.spanBadge}>{item.span}</span>}
                </div>
                <div className={styles.cardActions}>
                  <button className={`${styles.actionBtn} ${styles.visBtn}`} onClick={() => handleToggleVisible(item.id, item.isVisible)}>
                    {item.isVisible ? "লুকান" : "দেখান"}
                  </button>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(item)}>
                    সম্পাদনা
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setDeleteId(item.id)}>
                    মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{form.id ? "ছবি সম্পাদনা" : "নতুন ছবি যোগ"}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              {/* Image Upload */}
              <div className={styles.uploadArea}>
                {form.image ? (
                  <div className={styles.previewWrap}>
                    <Image src={form.image} alt="Preview" width={400} height={250} className={styles.preview} style={{ objectFit: "cover" }} />
                    <button className={styles.removeImgBtn} onClick={() => setForm((prev) => ({ ...prev, image: "" }))}>✕ সরান</button>
                  </div>
                ) : (
                  <div className={styles.uploadBox} onClick={() => fileRef.current?.click()}>
                    <div className={styles.uploadIcon}>📷</div>
                    <p>{uploading ? "আপলোড হচ্ছে..." : "ক্লিক করে ছবি আপলোড করুন"}</p>
                    <span>JPG, PNG, WebP — সর্বোচ্চ ৫MB</span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} hidden />
              </div>

              {/* Or URL */}
              <div className={styles.formGroup}>
                <label>অথবা ছবির URL দিন</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://... অথবা /uploads/..."
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>শিরোনাম (ইংরেজি) *</label>
                  <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Training Session" />
                </div>
                <div className={styles.formGroup}>
                  <label>শিরোনাম (বাংলা)</label>
                  <input value={form.titleBn} onChange={(e) => setForm((prev) => ({ ...prev, titleBn: e.target.value }))} placeholder="প্রশিক্ষণ সেশন" />
                </div>
                <div className={styles.formGroup}>
                  <label>ক্যাটাগরি *</label>
                  <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
                    <option value="">নির্বাচন করুন</option>
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>সাইজ</label>
                  <select value={form.span} onChange={(e) => setForm((prev) => ({ ...prev, span: e.target.value }))}>
                    <option value="">সাধারণ</option>
                    <option value="wide">ওয়াইড</option>
                    <option value="tall">টল</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>ক্রম</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                  <input type="checkbox" id="galleryVisible" checked={form.isVisible} onChange={(e) => setForm((prev) => ({ ...prev, isVisible: e.target.checked }))} />
                  <label htmlFor="galleryVisible">দৃশ্যমান</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>বিবরণ</label>
                <textarea value={form.desc} onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))} rows={2} placeholder="ছবির বিবরণ..." />
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>বাতিল</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? "সংরক্ষণ হচ্ছে..." : form.id ? "আপডেট" : "যোগ করুন"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h4>ছবি মুছতে চান?</h4>
            <p>এই ক্রিয়া পূর্বাবস্থায় ফেরানো যাবে না।</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>বাতিল</button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>মুছে ফেলুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
