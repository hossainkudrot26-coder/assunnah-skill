"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./ImageUploader.module.css";

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    /** Optional label for the upload area */
    label?: string;
    /** Optional hint text */
    hint?: string;
    /** Max file size in MB (default: 5) */
    maxSizeMB?: number;
    /** Preview height in px (default: 250) */
    previewHeight?: number;
    /** Whether to show URL fallback input */
    showUrlFallback?: boolean;
}

/**
 * Reusable image uploader component for admin pages.
 *
 * Features:
 * - Click-to-upload with file picker
 * - Live preview with remove button
 * - Indeterminate progress bar during upload
 * - URL fallback input
 * - Bengali labels
 */
export default function ImageUploader({
    value,
    onChange,
    label = "ছবি আপলোড করুন",
    hint = "JPG, PNG, WebP — সর্বোচ্চ ৫MB",
    maxSizeMB = 5,
    previewHeight = 250,
    showUrlFallback = true,
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side size check
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`ফাইল সাইজ ${maxSizeMB}MB-এর বেশি হতে পারবে না`);
            return;
        }

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (data.success) {
                onChange(data.url);
            } else {
                setError(data.error || "আপলোড ব্যর্থ");
            }
        } catch {
            setError("আপলোড করতে সমস্যা হয়েছে");
        }

        setUploading(false);
        // Reset file input so same file can be re-selected
        if (fileRef.current) fileRef.current.value = "";
    };

    return (
        <div className={styles.uploadArea}>
            {value ? (
                <div className={styles.previewWrap}>
                    <Image
                        src={value}
                        alt="Preview"
                        width={400}
                        height={previewHeight}
                        className={styles.preview}
                        style={{ objectFit: "cover", maxHeight: previewHeight }}
                    />
                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => onChange("")}
                    >
                        ✕ সরান
                    </button>
                </div>
            ) : (
                <div
                    className={`${styles.uploadBox} ${uploading ? styles.uploadBoxUploading : ""}`}
                    onClick={() => !uploading && fileRef.current?.click()}
                >
                    <div className={styles.uploadIcon}>📷</div>
                    <p className={styles.uploadLabel}>
                        {uploading ? "আপলোড হচ্ছে..." : label}
                    </p>
                    <span className={styles.uploadHint}>{hint}</span>
                    {uploading && (
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} />
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleUpload}
                hidden
            />

            {error && <div className={styles.uploadError}>{error}</div>}

            {showUrlFallback && !value && (
                <div className={styles.urlFallback}>
                    <label className={styles.urlLabel}>অথবা ছবির URL দিন</label>
                    <input
                        type="url"
                        className={styles.urlInput}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            )}
        </div>
    );
}
