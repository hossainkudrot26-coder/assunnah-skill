/**
 * As-Sunnah Skill Development Institute — Logo Component
 *
 * Uses the real institutional logo icon (PNG) for pixel-perfect accuracy.
 *
 * Variants:
 *   "full"     — icon + AS-SUNNAH + subtitle (header, footer)
 *   "compact"  — icon + AS-SUNNAH (sidebar, mobile)
 *   "icon"     — icon only (favicon, avatar)
 */

import Link from "next/link";
import Image from "next/image";

type LogoVariant = "full" | "compact" | "icon";

interface LogoProps {
  variant?: LogoVariant;
  height?: number;
  dark?: boolean; // true = white text for dark backgrounds
  href?: string;
  className?: string;
}

function LogoIcon({ size = 36, className }: { size?: number; className?: string }) {
  // Aspect ratio of logo-icon.png: 91x120 → width = size * (91/120)
  const width = Math.round(size * (91 / 120));
  return (
    <Image
      src="/images/logo-icon.png"
      alt=""
      width={width}
      height={size}
      className={className}
      aria-hidden={true}
      priority
      style={{ objectFit: "contain" }}
    />
  );
}

export default function Logo({
  variant = "full",
  height = 36,
  dark = false,
  href = "/",
  className,
}: LogoProps) {
  const textColor = dark ? "#FFFFFF" : "#0D8A4A";
  const subtitleColor = dark ? "rgba(255,255,255,0.7)" : "#5BBB5E";
  const iconSize = height;

  const content = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: variant === "icon" ? 0 : height * 0.22,
        textDecoration: "none",
        lineHeight: 1,
      }}
      className={className}
    >
      <LogoIcon size={iconSize} />

      {variant !== "icon" && (
        <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            style={{
              fontSize: height * 0.55,
              fontWeight: 700,
              color: textColor,
              letterSpacing: "0.04em",
              fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
              lineHeight: 1.1,
            }}
          >
            AS-SUNNAH
          </span>
          {variant === "full" && (
            <span
              style={{
                fontSize: height * 0.23,
                fontWeight: 500,
                color: subtitleColor,
                letterSpacing: "0.15em",
                fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                lineHeight: 1.2,
              }}
            >
              SKILL DEVELOPMENT INSTITUTE
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "inline-flex" }} aria-label="আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট">
        {content}
      </Link>
    );
  }

  return content;
}

export { LogoIcon };
