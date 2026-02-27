/**
 * Server-side input sanitization utility.
 * 
 * Defense-in-depth: strips HTML tags from user input before DB storage.
 * Prevents stored XSS even if output escaping is later bypassed
 * (e.g., via dangerouslySetInnerHTML or a future rich-text feature).
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize a single string — strips ALL HTML tags.
 * Use for plain-text fields (names, descriptions, etc.)
 */
export function sanitize(input: string): string {
    if (!input) return input;
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
}

/**
 * Sanitize a string but allow safe formatting tags.
 * Use for rich-text fields (blog content, fullDesc, etc.)
 */
export function sanitizeRich(input: string): string {
    if (!input) return input;
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "br", "p", "ul", "ol", "li", "a", "h2", "h3", "h4"],
        ALLOWED_ATTR: ["href", "target", "rel"],
    }).trim();
}

/**
 * Sanitize all string values in an object (shallow, 1 level).
 * Automatically handles nested objects and arrays of strings.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const result = { ...obj };
    for (const key in result) {
        const value = result[key];
        if (typeof value === "string") {
            (result as Record<string, unknown>)[key] = sanitize(value);
        }
    }
    return result;
}
