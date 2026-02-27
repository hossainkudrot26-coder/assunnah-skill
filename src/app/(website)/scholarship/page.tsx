import type { Metadata } from "next";
import { getSetting } from "@/lib/actions/data";
import ScholarshipClient from "./ScholarshipClient";

export const metadata: Metadata = {
  title: "স্কলারশিপ",
  description:
    "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটে মেধাবী ও সুবিধাবঞ্চিত শিক্ষার্থীদের জন্য বিশেষ স্কলারশিপ ব্যবস্থা",
};

/* ═══════════════════════════════════════════
   DEFAULT DATA (fallback when DB is empty)
   ═══════════════════════════════════════════ */

const defaultScholarshipData = {
  types: [
    {
      title: "আবাসন স্কলারশিপ",
      percentage: "১০০%",
      desc: "থাকা ও খাওয়ার সম্পূর্ণ খরচ প্রতিষ্ঠান বহন করবে",
      iconKey: "heart",
    },
    {
      title: "টিউশন স্কলারশিপ",
      percentage: "৮০%",
      desc: "টিউশন ফি-র ৮০% পর্যন্ত মওকুফ করা হয়",
      iconKey: "graduation",
    },
    {
      title: "সম্পূর্ণ ফ্রি কোর্স",
      percentage: "১০০%",
      desc: "শেফ ট্রেনিং, ড্রাইভিং ও জুতা শিল্প কোর্সগুলো সম্পূর্ণ বিনামূল্যে",
      iconKey: "award",
    },
  ],
  eligibility: [
    "বাংলাদেশের নাগরিক",
    "আর্থিকভাবে সুবিধাবঞ্চিত পরিবার",
    "মেধাবী ও অধ্যবসায়ী শিক্ষার্থী",
    "নির্ধারিত বয়সসীমার মধ্যে",
    "নিয়মিত উপস্থিতির প্রতিশ্রুতি",
    "প্রতিষ্ঠানের নিয়ম-কানুন মেনে চলার ইচ্ছুক",
  ],
  applicationSteps: [
    "ভর্তি আবেদনের সময় স্কলারশিপের জন্য আবেদন করুন",
    "আর্থিক অবস্থার প্রমাণপত্র জমা দিন",
    "মেধা মূল্যায়ন পরীক্ষায় অংশগ্রহণ করুন",
    "সাক্ষাৎকারে অংশ নিন",
    "ফলাফল জানানো হবে",
  ],
};

/* ═══════════════════════════════════════════
   TYPES (exported for client)
   ═══════════════════════════════════════════ */

export interface ScholarshipType {
  title: string;
  percentage: string;
  desc: string;
  iconKey: string;
}

export interface ScholarshipData {
  types: ScholarshipType[];
  eligibility: string[];
  applicationSteps: string[];
}

/* ═══════════════════════════════════════════
   SERVER COMPONENT
   ═══════════════════════════════════════════ */

export default async function ScholarshipPage() {
  let data: ScholarshipData = defaultScholarshipData;

  try {
    const settingValue = await getSetting("scholarship_content");
    if (settingValue) {
      // getSetting auto-parses JSON type settings, so value may be object or string
      const parsed = typeof settingValue === "string" ? JSON.parse(settingValue) : settingValue;
      if (parsed?.types && parsed?.eligibility && parsed?.applicationSteps) {
        data = parsed;
      }
    }
  } catch {
    // Fallback to defaults — setting doesn't exist yet
  }

  return <ScholarshipClient data={data} />;
}
