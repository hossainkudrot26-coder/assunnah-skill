/**
 * In-memory rate limiter for server actions.
 *
 * Uses a sliding window approach. Each key gets a fixed number of attempts
 * within a time window. After the window expires, the counter resets.
 *
 * For production with multiple instances, replace with Redis-backed limiter.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
    }
}

export interface RateLimitConfig {
    /** Maximum attempts within the window */
    maxAttempts: number;
    /** Window duration in seconds */
    windowSeconds: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}

/**
 * Check rate limit for a given key.
 *
 * @param key - Unique identifier (e.g., IP address, user ID, phone number)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed
 *
 * @example
 * ```typescript
 * const result = checkRateLimit(`login:${email}`, { maxAttempts: 5, windowSeconds: 300 });
 * if (!result.allowed) {
 *   return { success: false, error: `অনুগ্রহ করে ${result.retryAfterSeconds} সেকেন্ড পরে চেষ্টা করুন` };
 * }
 * ```
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
    cleanup();

    const now = Date.now();
    const entry = store.get(key);

    // No existing entry or window expired → fresh start
    if (!entry || now > entry.resetAt) {
        store.set(key, {
            count: 1,
            resetAt: now + config.windowSeconds * 1000,
        });
        return {
            allowed: true,
            remaining: config.maxAttempts - 1,
            retryAfterSeconds: 0,
        };
    }

    // Within window — check count
    if (entry.count >= config.maxAttempts) {
        const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds,
        };
    }

    // Increment and allow
    entry.count += 1;
    return {
        allowed: true,
        remaining: config.maxAttempts - entry.count,
        retryAfterSeconds: 0,
    };
}

// ──────────── Preset Configs ────────────

/** Login: 5 attempts per 5 minutes per email */
export const LOGIN_LIMIT: RateLimitConfig = { maxAttempts: 5, windowSeconds: 300 };

/** Registration: 3 attempts per 10 minutes per IP/phone */
export const REGISTER_LIMIT: RateLimitConfig = { maxAttempts: 3, windowSeconds: 600 };

/** Contact form: 3 submissions per 10 minutes per phone */
export const CONTACT_LIMIT: RateLimitConfig = { maxAttempts: 3, windowSeconds: 600 };

/** Application: 2 submissions per 15 minutes per phone */
export const APPLICATION_LIMIT: RateLimitConfig = { maxAttempts: 2, windowSeconds: 900 };

/** Password reset: 3 requests per 15 minutes per email */
export const RESET_LIMIT: RateLimitConfig = { maxAttempts: 3, windowSeconds: 900 };
