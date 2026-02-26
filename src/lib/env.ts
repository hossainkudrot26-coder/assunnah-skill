/**
 * Environment variable validation — runs at import time.
 *
 * Import this module in `src/lib/db.ts` to ensure
 * required environment variables are set before the app starts.
 */

const requiredVars = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
] as const;

const recommendedVars = [
    "NEXTAUTH_URL",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "ADMIN_EMAIL",
] as const;

// Skip validation during build time (next build doesn't have runtime secrets)
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

if (!isBuildTime) {
    // Validate required vars
    const missing = requiredVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}\n\nAdd them to your .env or .env.local file.`
        );
    }

    // Warn about recommended vars in development
    if (process.env.NODE_ENV === "development") {
        const missingRecommended = recommendedVars.filter((key) => !process.env[key]);
        if (missingRecommended.length > 0) {
            console.warn(
                `⚠️  Missing recommended environment variables:\n${missingRecommended.map((k) => `  - ${k}`).join("\n")}`
            );
        }
    }
}

export { };
