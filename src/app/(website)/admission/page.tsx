import type { Metadata } from "next";
import { getSetting } from "@/lib/actions/data";
import AdmissionClient from "./AdmissionClient";

export const metadata: Metadata = {
  title: "ভর্তি প্রক্রিয়া",
  description:
    "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটে ভর্তির ধাপসমূহ ও প্রয়োজনীয় কাগজপত্র",
};

/* ═══════════════════════════════════════════
   DEFAULT DATA (fallback when DB is empty)
   ═══════════════════════════════════════════ */

const defaultAdmissionData = {
  steps: [
    {
      number: "০১",
      title: "কোর্স নির্বাচন",
      desc: "আমাদের ওয়েবসাইট থেকে আপনার পছন্দের কোর্সটি দেখুন এবং বিস্তারিত জানুন।",
      iconKey: "book",
      color: "#1B8A50",
    },
    {
      number: "০২",
      title: "যোগাযোগ",
      desc: "ফোন বা ইমেইলে আমাদের সাথে যোগাযোগ করুন। ভর্তি সংক্রান্ত বিস্তারিত জানুন।",
      iconKey: "phone",
      color: "#1565C0",
    },
    {
      number: "০৩",
      title: "আবেদন ও ডকুমেন্ট",
      desc: "প্রয়োজনীয় কাগজপত্রসহ আবেদন ফর্ম পূরণ করুন এবং জমা দিন।",
      iconKey: "clipboard",
      color: "#E65100",
    },
    {
      number: "০৪",
      title: "সাক্ষাৎকার",
      desc: "একটি সংক্ষিপ্ত সাক্ষাৎকারে অংশগ্রহণ করুন। আপনার আগ্রহ ও যোগ্যতা যাচাই করা হবে।",
      iconKey: "user",
      color: "#6A1B9A",
    },
    {
      number: "০৫",
      title: "ভর্তি নিশ্চিতকরণ",
      desc: "নির্বাচিত হলে ভর্তি নিশ্চিত করুন। স্কলারশিপের জন্য আলাদা মূল্যায়ন হবে।",
      iconKey: "check",
      color: "#2E7D32",
    },
  ],
  documents: [
    "জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন সনদ",
    "সর্বশেষ শিক্ষাগত সনদের ফটোকপি",
    "পাসপোর্ট সাইজ ছবি (২ কপি)",
    "অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি",
    "স্থানীয় চেয়ারম্যান / কাউন্সিলর প্রত্যয়নপত্র",
  ],
};

/* ═══════════════════════════════════════════
   TYPES (exported for client)
   ═══════════════════════════════════════════ */

export interface AdmissionStep {
  number: string;
  title: string;
  desc: string;
  iconKey: string;
  color: string;
}

export interface AdmissionData {
  steps: AdmissionStep[];
  documents: string[];
}

/* ═══════════════════════════════════════════
   SERVER COMPONENT
   ═══════════════════════════════════════════ */

export default async function AdmissionPage() {
  let data: AdmissionData = defaultAdmissionData;

  try {
    const settingValue = await getSetting("admission_content");
    if (settingValue) {
      // getSetting auto-parses JSON type settings, so value may be object or string
      const parsed = typeof settingValue === "string" ? JSON.parse(settingValue) : settingValue;
      if (parsed?.steps && parsed?.documents) {
        data = parsed;
      }
    }
  } catch {
    // Fallback to defaults — setting doesn't exist yet
  }

  return <AdmissionClient data={data} />;
}
