import React from "react";

interface IconProps {
    size?: number;
    className?: string;
    color?: string;
    strokeWidth?: number;
}

/* ——— GRADUATION CAP ——— */
export function GraduationIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L1 7.5L12 13L23 7.5L12 2Z" fill={color} opacity="0.2" />
            <path d="M12 2L1 7.5L12 13L23 7.5L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M5 10V16C5 16 8 19 12 19C16 19 19 16 19 16V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M23 7.5V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— BOOK OPEN ——— */
export function BookIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M2 3H8C9.06 3 10.08 3.42 10.83 4.17C11.58 4.92 12 5.94 12 7V21C12 20.2 11.68 19.44 11.12 18.88C10.56 18.32 9.8 18 9 18H2V3Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 3H16C14.94 3 13.92 3.42 13.17 4.17C12.42 4.92 12 5.94 12 7V21C12 20.2 12.32 19.44 12.88 18.88C13.44 18.32 14.2 18 15 18H22V3Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— MONITOR/COMPUTER ——— */
export function MonitorIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="2" y="3" width="20" height="14" rx="2" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— GLOBE ——— */
export function GlobeIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="4" ry="10" stroke={color} strokeWidth="1.5" />
            <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— BRIEFCASE ——— */
export function BriefcaseIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="2" y="7" width="20" height="14" rx="2" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M16 7V5C16 3.895 15.105 3 14 3H10C8.895 3 8 3.895 8 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="12" x2="12" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— CHEF HAT ——— */
export function ChefHatIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6 19V13C6 10 4 9 4 6.5C4 3.46 6.46 1 9.5 1C10.8 1 12 1.5 12 1.5C12 1.5 13.2 1 14.5 1C17.54 1 20 3.46 20 6.5C20 9 18 10 18 13V19" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="5" y1="19" x2="19" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="22" x2="19" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— SCISSORS (Tailoring) ——— */
export function ScissorsIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="6" cy="6" r="3" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <circle cx="6" cy="18" r="3" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— CHART/ANALYTICS ——— */
export function ChartIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <path d="M7 17V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <path d="M12 17V9" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <path d="M17 17V7" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

/* ——— CODE ——— */
export function CodeIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="2" y="3" width="20" height="18" rx="2" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <polyline points="8,10 5,13 8,16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16,10 19,13 16,16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="13" y1="9" x2="11" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— CAR ——— */
export function CarIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M5 17H3C2.45 17 2 16.55 2 16V12.5L4 7H20L22 12.5V16C22 16.55 21.55 17 21 17H19" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="7" cy="17" r="2" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
            <circle cx="17" cy="17" r="2" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
            <line x1="5" y1="12.5" x2="19" y2="12.5" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— TARGET ——— */
export function TargetIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill={color} opacity="0.06" stroke={color} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="6" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
    );
}

/* ——— SHIELD CHECK ——— */
export function ShieldCheckIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <polyline points="9,12 11,14 15,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— USERS ——— */
export function UsersIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="7" r="4" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M23 21V19C23 17.54 22.12 16.27 20.84 15.76" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16.84 3.76C18.12 4.27 19 5.54 19 7C19 8.46 18.12 9.73 16.84 10.24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— HEART ——— */
export function HeartIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M20.84 4.61C20.33 4.1 19.72 3.69 19.04 3.42C18.37 3.15 17.65 3 16.92 3C16.19 3 15.47 3.15 14.8 3.42C14.12 3.69 13.51 4.1 13 4.61L12 5.67L11 4.61C9.97 3.58 8.56 3 7.08 3C5.6 3 4.19 3.58 3.16 4.61C2.13 5.64 1.55 7.05 1.55 8.53C1.55 10.01 2.13 11.42 3.16 12.45L12 21.35L20.84 12.45C21.35 11.94 21.76 11.33 22.03 10.66C22.3 9.98 22.45 9.26 22.45 8.53C22.45 7.8 22.3 7.08 22.03 6.4C21.76 5.73 21.35 5.12 20.84 4.61Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— TROPHY ——— */
export function TrophyIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6 2H18V9C18 12.31 15.31 15 12 15C8.69 15 6 12.31 6 9V2Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M6 5H2V8C2 9.66 3.34 11 5 11H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 5H22V8C22 9.66 20.66 11 19 11H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="15" x2="12" y2="19" stroke={color} strokeWidth="1.5" />
            <line x1="8" y1="19" x2="16" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="22" x2="17" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— BUILDING ——— */
export function BuildingIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="3" y="2" width="18" height="20" rx="1" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <rect x="7" y="6" width="3" height="3" rx="0.5" fill={color} opacity="0.2" />
            <rect x="14" y="6" width="3" height="3" rx="0.5" fill={color} opacity="0.2" />
            <rect x="7" y="12" width="3" height="3" rx="0.5" fill={color} opacity="0.2" />
            <rect x="14" y="12" width="3" height="3" rx="0.5" fill={color} opacity="0.2" />
            <rect x="10" y="18" width="4" height="4" fill={color} opacity="0.15" stroke={color} strokeWidth="1" />
        </svg>
    );
}

/* ——— QUOTE ——— */
export function QuoteIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M3 21C3 21 4 17 4 14V10C4 8.34 5.34 7 7 7H8C9.66 7 11 8.34 11 10V12C11 13.66 9.66 15 8 15H6C6 15 6 19 3 21Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M13 21C13 21 14 17 14 14V10C14 8.34 15.34 7 17 7H18C19.66 7 21 8.34 21 10V12C21 13.66 19.66 15 18 15H16C16 15 16 19 13 21Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— SPARKLE/STAR ——— */
export function SparkleIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L14.5 8.5L21 12L14.5 15.5L12 22L9.5 15.5L3 12L9.5 8.5L12 2Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— MOSQUE ——— */
export function MosqueIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2C12 2 8 6 8 9V22H16V9C16 6 12 2 12 2Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="12" y1="0" x2="12" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <rect x="2" y="12" width="6" height="10" fill={color} opacity="0.05" stroke={color} strokeWidth="1.5" rx="1" />
            <rect x="16" y="12" width="6" height="10" fill={color} opacity="0.05" stroke={color} strokeWidth="1.5" rx="1" />
            <circle cx="12" cy="14" r="2" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— BALANCE/SCALE ——— */
export function BalanceIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 7L2 14H10L4 7Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M20 7L18 14H22L20 7Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— ARROW RIGHT ——— */
export function ArrowRightIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    );
}

/* ——— PHONE ——— */
export function PhoneIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— CLOCK ——— */
export function ClockIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— CHECK CIRCLE ——— */
export function CheckCircleIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <polyline points="9,12 11,14 15,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ═══════════════════════════════════════════
   NEW ICONS — For replacing emojis site-wide
   ═══════════════════════════════════════════ */

/* ——— MAP PIN (location/address) ——— */
export function MapPinIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <circle cx="12" cy="10" r="3" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— MAIL (email) ——— */
export function MailIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="2" y="4" width="20" height="16" rx="2" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <polyline points="22,6 12,13 2,6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— SEND (form submit) ——— */
export function SendIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="22,2 15,22 11,13 2,9" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— LOCK (security) ——— */
export function LockIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="3" y="11" width="18" height="11" rx="2" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.5" fill={color} />
        </svg>
    );
}

/* ——— CALENDAR (timeline/events) ——— */
export function CalendarIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="3" y="4" width="18" height="18" rx="2" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5" />
            <rect x="7" y="14" width="3" height="3" rx="0.5" fill={color} opacity="0.2" />
        </svg>
    );
}

/* ——— DIAMOND (values/premium) ——— */
export function DiamondIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6 3H18L22 9L12 22L2 9L6 3Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="2" y1="9" x2="22" y2="9" stroke={color} strokeWidth="1.5" />
            <line x1="12" y1="3" x2="12" y2="9" stroke={color} strokeWidth="1.5" />
            <line x1="12" y1="9" x2="12" y2="22" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
        </svg>
    );
}

/* ——— IMAGE (gallery/photo) ——— */
export function ImageIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" fill={color} opacity="0.3" />
            <path d="M21 15l-5-5L5 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— MESSAGE CIRCLE (stories/testimonials) ——— */
export function MessageCircleIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— WRENCH (construction/plumbing) ——— */
export function WrenchIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— ZAP (electrical) ——— */
export function ZapIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— FILM (content creation) ——— */
export function FilmIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="2" y="2" width="20" height="20" rx="2.18" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <line x1="7" y1="2" x2="7" y2="22" stroke={color} strokeWidth="1.5" />
            <line x1="17" y1="2" x2="17" y2="22" stroke={color} strokeWidth="1.5" />
            <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" />
            <line x1="2" y1="7" x2="7" y2="7" stroke={color} strokeWidth="1.5" />
            <line x1="2" y1="17" x2="7" y2="17" stroke={color} strokeWidth="1.5" />
            <line x1="17" y1="7" x2="22" y2="7" stroke={color} strokeWidth="1.5" />
            <line x1="17" y1="17" x2="22" y2="17" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— AWARD (achievements/certification) ——— */
export function AwardIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="8" r="7" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="8" r="3" fill={color} opacity="0.15" />
        </svg>
    );
}

/* ——— HOME (dashboard) ——— */
export function HomeIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="9,22 9,12 15,12 15,22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— MEGAPHONE (announcements) ——— */
export function MegaphoneIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— CLIPBOARD (forms) ——— */
export function ClipboardIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <rect x="8" y="2" width="8" height="4" rx="1" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
            <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="16" x2="13" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— CHAT (messages) ——— */
export function ChatIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="13" x2="13" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— STAR (ratings) ——— */
export function StarIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— LAYERS (categories) ——— */
export function LayersIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <polygon points="12,2 2,7 12,12 22,7" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="2,17 12,22 22,17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="2,12 12,17 22,12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— USER (single user) ——— */
export function UserIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— VERIFIED (NSDA badge) ——— */
export function VerifiedIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2l2.4 2.8L17.6 4l.8 3.6 3.6.8-1.2 3.2L23.2 14l-2.8 2.4.4 3.6-3.6.8-1.6 3.2-3.6-1.2L8.4 24l-1.6-3.2-3.6-.8.4-3.6L.8 14l2.4-2.4L2 8.4l3.6-.8L6.4 4l3.2 1.2L12 2z" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <polyline points="9,12 11,14 15,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— PLAY (video/content) ——— */
export function PlayIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <polygon points="10,8 16,12 10,16" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

/* ——— SHOE (footwear) ——— */
export function ShoeIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M2 16l2-6c1-3 3-4 5-4h2l1 2h4l3 2h3v6H2z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="2" y1="16" x2="22" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11 8l1 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— HANDSHAKE (events) ——— */
export function HandshakeIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M20 8l-4-4-5 5-2-2-5 5v6h6l5-5 2 2 5-5v-2z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            <line x1="4" y1="18" x2="4" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="12" x2="20" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— CAMERA (photography) ——— */
export function CameraIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
            <circle cx="12" cy="13" r="4" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

/* ——— MICROPHONE (events/talks) ——— */
export function MicIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="9" y="1" width="6" height="12" rx="3" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="23" x2="16" y2="23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ——— PARTY/CELEBRATION ——— */
export function PartyIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M4 22l4-16 12 12-16 4z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="14" y1="2" x2="14" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="8" x2="22" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="3" x2="19" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function XIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function ChevronLeftIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <polyline points="15,18 9,12 15,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ChevronRightIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <polyline points="9,6 15,12 9,18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ExpandIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <polyline points="15,3 21,3 21,9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="9,21 3,21 3,15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="3" x2="14" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="21" x2="10" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function ArrowLeftIcon({ size = 24, className, color = "currentColor" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <polyline points="12,19 5,12 12,5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
