/**
 * SEO metadata utility.
 *
 * Reads admin-configured SEO settings from the database
 * and generates Next.js Metadata objects.
 *
 * Fallback: uses siteConfig values when DB values are not set.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/actions/data";

const SEO_KEYS = ["seo_title", "seo_description", "seo_keywords", "seo_ogImage"];

/**
 * Generate SEO metadata from admin settings with siteConfig fallback.
 *
 * Usage in layout.tsx:
 * ```typescript
 * import { generateSeoMeta } from "@/lib/seo";
 *
 * export async function generateMetadata(): Promise<Metadata> {
 *   return generateSeoMeta();
 * }
 * ```
 */
export async function generateSeoMeta(overrides?: {
    title?: string;
    description?: string;
}): Promise<Metadata> {
    const data = await getSettings(SEO_KEYS);

    const title = overrides?.title || data.seo_title || siteConfig.shortNameBn;
    const description = overrides?.description || data.seo_description || siteConfig.description;
    const keywords = data.seo_keywords
        ? (data.seo_keywords as string).split(",").map((k: string) => k.trim()).filter(Boolean)
        : ["আস-সুন্নাহ", "স্কিল ডেভেলপমেন্ট", "প্রশিক্ষণ"];
    const ogImage = data.seo_ogImage || siteConfig.logo;

    return {
        title: {
            default: `${title} — ${description}`,
            template: `%s | ${title}`,
        },
        description,
        keywords,
        openGraph: {
            type: "website",
            locale: "bn_BD",
            url: siteConfig.url,
            title,
            description,
            siteName: siteConfig.name,
            ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
        metadataBase: new URL(siteConfig.url),
    };
}
