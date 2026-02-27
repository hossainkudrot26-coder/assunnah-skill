import React from "react";
import {
    GraduationIcon, BookIcon,
    ShieldCheckIcon,
    MosqueIcon, TrophyIcon, HeartIcon,
    HandshakeIcon, BuildingIcon, AwardIcon,
} from "@/shared/components/Icons";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

export interface DisplayCourse {
    id: string;
    slug: string;
    title: string;
    desc: string;
    duration: string;
    type: string;
    icon: React.ReactNode;
    color: string;
    featured: boolean;
}

export interface DisplayTestimonial {
    name: string;
    batch: string;
    text: string;
    initials: string;
}

export interface MarqueeStat {
    value: string;
    label: string;
}

export interface ImpactCounter {
    end: number;
    suffix: string;
    label: string;
}

export interface PartnerData {
    name: string;
    abbr: string;
    color: string;
    desc: string;
}

export interface HomePageClientProps {
    courses: DisplayCourse[];
    testimonials: DisplayTestimonial[];
    stats?: MarqueeStat[] | null;
    impactNumbers?: ImpactCounter[] | null;
    partners?: PartnerData[] | null;
}

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

export const ease = [0.22, 1, 0.36, 1] as const;

export const heroStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

export const heroChild = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease },
    },
};

export const sectionStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeScale = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

export const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

/* ═══════════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════════ */

export const marqueeStats = [
    { value: "২,৫০০+", label: "প্রশিক্ষিত শিক্ষার্থী" },
    { value: "২০+", label: "চালু কোর্স" },
    { value: "৭টি", label: "কম্পিউটার ল্যাব" },
    { value: "১০,৯৬২+", label: "অনলাইন শিক্ষার্থী" },
    { value: "২৪,০০০", label: "স্কয়ার ফিট ক্যাম্পাস" },
    { value: "১০০%", label: "স্কলারশিপ সুবিধা" },
];

export const features = [
    { icon: <ShieldCheckIcon size={24} color="var(--color-primary-500)" />, title: "NSDA নিবন্ধিত", desc: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ কর্তৃক স্বীকৃত" },
    { icon: <GraduationIcon size={24} color="var(--color-primary-500)" />, title: "স্কলারশিপ সুবিধা", desc: "মেধাবী ও সুবিধাবঞ্চিতদের জন্য ১০০% পর্যন্ত স্কলারশিপ" },
    { icon: <MosqueIcon size={24} color="var(--color-primary-500)" />, title: "পৃথক পরিবেশ", desc: "নারী ও পুরুষের জন্য সম্পূর্ণ পৃথক প্রশিক্ষণ ব্যবস্থা" },
    { icon: <TrophyIcon size={24} color="var(--color-accent-500)" />, title: "জব প্লেসমেন্ট", desc: "প্রশিক্ষণ শেষে কর্মসংস্থানের সুযোগ ও সহায়তা" },
];

export const whyChooseUs = [
    { icon: <ShieldCheckIcon size={28} color="var(--color-primary-500)" />, title: "সরকারি স্বীকৃতি", desc: "NSDA নিবন্ধিত — আপনার সার্টিফিকেট সরকারিভাবে গ্রহণযোগ্য", highlight: "NSDA" },
    { icon: <HeartIcon size={28} color="#E65100" />, title: "সম্পূর্ণ বিনামূল্যে", desc: "অনেক কোর্সে ১০০% ফ্রি প্রশিক্ষণ — থাকা-খাওয়া সহ", highlight: "ফ্রি" },
    { icon: <BuildingIcon size={28} color="#1565C0" />, title: "আবাসিক ক্যাম্পাস", desc: "২৪,০০০ স্কয়ার ফিটের আধুনিক ক্যাম্পাসে রেসিডেন্সিয়াল প্রশিক্ষণ", highlight: "২৪,০০০ sqft" },
    { icon: <HandshakeIcon size={28} color="#7B1FA2" />, title: "চাকরি সহায়তা", desc: "প্রশিক্ষণ শেষে কর্মসংস্থান ও উদ্যোক্তাদের জন্য আর্থিক সহায়তা", highlight: "চাকরি" },
    { icon: <MosqueIcon size={28} color="#2E7D32" />, title: "ইসলামি পরিবেশ", desc: "ইসলামি মূল্যবোধের আলোকে — নারী-পুরুষ সম্পূর্ণ পৃথক ব্যবস্থা", highlight: "পৃথক" },
    { icon: <AwardIcon size={28} color="#D4A843" />, title: "অভিজ্ঞ প্রশিক্ষক", desc: "ইন্ডাস্ট্রি এক্সপার্টদের তত্ত্বাবধানে হাতে-কলমে শিক্ষা ও ২৪/৭ মেন্টর সাপোর্ট", highlight: "২৪/৭" },
];

export const impactCounters = [
    { end: 2500, suffix: "+", label: "প্রশিক্ষিত শিক্ষার্থী", icon: <GraduationIcon size={32} color="var(--color-secondary-400)" /> },
    { end: 15, suffix: "টি", label: "সম্পন্ন ব্যাচ", icon: <AwardIcon size={32} color="var(--color-accent-400)" /> },
    { end: 95, suffix: "%", label: "কর্মসংস্থান হার", icon: <TrophyIcon size={32} color="#E65100" /> },
    { end: 24000, suffix: "", label: "স্কয়ার ফিট ক্যাম্পাস", icon: <BuildingIcon size={32} color="#1565C0" /> },
];

export const partnerLogos = [
    { name: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ", abbr: "NSDA", color: "#1B6B3A", desc: "সরকারি নিবন্ধন" },
    { name: "আস-সুন্নাহ ফাউন্ডেশন", abbr: "ASF", color: "#1B8A50", desc: "প্রতিষ্ঠাতা সংস্থা" },
    { name: "বাংলাদেশ কারিগরি শিক্ষা বোর্ড", abbr: "BTEB", color: "#1565C0", desc: "কারিগরি সনদ" },
    { name: "তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ", abbr: "ICT", color: "#7B1FA2", desc: "ডিজিটাল প্রশিক্ষণ" },
    { name: "যুব ও ক্রীড়া মন্ত্রণালয়", abbr: "MoYS", color: "#E65100", desc: "যুব উন্নয়ন" },
    { name: "সমাজসেবা অধিদপ্তর", abbr: "DSS", color: "#2E7D32", desc: "সামাজিক কল্যাণ" },
];

/* ═══════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════ */

export const faqItems = [
    {
        q: "ভর্তির জন্য কী কী যোগ্যতা প্রয়োজন?",
        a: "SSC/সমমান পাস হলেই ভর্তির জন্য যোগ্য। কিছু কোর্সে শিক্ষাগত যোগ্যতার প্রয়োজন নেই — শুধু শেখার ইচ্ছা থাকলেই হবে।",
    },
    {
        q: "প্রশিক্ষণ সম্পূর্ণ ফ্রি কি?",
        a: "অধিকাংশ কোর্স ১০০% ফ্রি — থাকা-খাওয়া সহ। কিছু কোর্সে নামেমাত্র ফি রয়েছে, তবে মেধাবী ও সুবিধাবঞ্চিতদের জন্য ১০০% পর্যন্ত স্কলারশিপ দেওয়া হয়।",
    },
    {
        q: "আবাসিক সুবিধা আছে কি?",
        a: "হ্যাঁ! ২৪,০০০ স্কয়ার ফিটের আধুনিক ক্যাম্পাসে সম্পূর্ণ রেসিডেন্সিয়াল ব্যবস্থা রয়েছে। থাকা, খাওয়া এবং ২৪/৭ মেন্টর সাপোর্ট প্রদান করা হয়।",
    },
    {
        q: "পুরুষ ও নারীদের জন্য পৃথক ব্যবস্থা আছে কি?",
        a: "অবশ্যই! ইসলামি মূল্যবোধের ভিত্তিতে পুরুষ ও নারীদের জন্য সম্পূর্ণ পৃথক প্রশিক্ষণ ক্যাম্পাস ও ক্লাসরুম রয়েছে।",
    },
    {
        q: "প্রশিক্ষণ শেষে কি সার্টিফিকেট দেওয়া হয়?",
        a: "হ্যাঁ! NSDA নিবন্ধিত সার্টিফিকেট প্রদান করা হয় যা সরকারিভাবে স্বীকৃত। এই সার্টিফিকেট আপনার ক্যারিয়ারে বিশেষভাবে মূল্যবান।",
    },
    {
        q: "চাকরির নিশ্চয়তা আছে কি?",
        a: "আমাদের ৯৫% শিক্ষার্থী প্রশিক্ষণ শেষে কর্মসংস্থান পেয়েছেন। আমরা জব প্লেসমেন্ট সাপোর্ট, উদ্যোক্তা অর্থায়ন এবং ক্যারিয়ার কাউন্সেলিং প্রদান করি।",
    },
];

/* ═══════════════════════════════════════════
   SOCIAL PROOF DATA
   ═══════════════════════════════════════════ */

export const socialProofEntries = [
    { name: "মোহাম্মদ রাফি", course: "স্মল বিজনেস ম্যানেজমেন্ট", location: "ঢাকা" },
    { name: "নাফিসা আক্তার", course: "স্মার্ট টেইলারিং", location: "চট্টগ্রাম" },
    { name: "আব্দুল করিম", course: "শেফ ট্রেনিং", location: "রাজশাহী" },
    { name: "ফারিয়া ইসলাম", course: "গ্রাফিক ডিজাইন", location: "সিলেট" },
    { name: "তানভীর হোসেন", course: "ড্রাইভিং ট্রেনিং", location: "খুলনা" },
];

/* ═══════════════════════════════════════════
   HERO CARD ROTATION DATA
   ═══════════════════════════════════════════ */

export const heroCards = [
    {
        title: "স্মল বিজনেস ম্যানেজমেন্ট",
        desc: "MS Office, গ্রাফিক ডিজাইন, ক্রিয়েটিভ মার্কেটিং, জেনারেটিভ AI",
        badge: "জনপ্রিয়",
        badgeColor: "#D4A843",
        duration: "৩ মাস",
        type: "রেসিডেন্সিয়াল",
    },
    {
        title: "স্মার্ট টেইলারিং",
        desc: "আধুনিক সেলাই, প্যাটার্ন ডিজাইন, ফ্যাশন ডিজাইন, উদ্যোক্তা প্রশিক্ষণ",
        badge: "নতুন ব্যাচ",
        badgeColor: "#1B8A50",
        duration: "৪ মাস",
        type: "রেসিডেন্সিয়াল",
    },
    {
        title: "প্রফেশনাল শেফ ট্রেনিং",
        desc: "বাংলাদেশি, চাইনিজ, ইতালিয়ান কুজিন, পেস্ট্রি, ফুড হাইজিন",
        badge: "ভর্তি চলছে",
        badgeColor: "#E65100",
        duration: "৬ মাস",
        type: "রেসিডেন্সিয়াল",
    },
];
