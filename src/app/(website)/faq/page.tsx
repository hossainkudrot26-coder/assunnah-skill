"use client";

import { useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import { Accordion, AccordionItem } from "@/shared/components/Accordion";
import {
  ChatIcon, BookIcon, AwardIcon, ClipboardIcon, UsersIcon,
} from "@/shared/components/Icons";
import styles from "./faq.module.css";

const faqCategories = [
  {
    key: "admission",
    label: "ভর্তি সংক্রান্ত",
    icon: <ClipboardIcon size={16} color="var(--color-primary-500)" />,
    questions: [
      {
        q: "ভর্তির জন্য কী কী যোগ্যতা লাগে?",
        a: "কোর্সভেদে যোগ্যতা ভিন্ন হয়। সাধারণত নূন্যতম ৮ম শ্রেণী থেকে HSC পাস পর্যন্ত বিভিন্ন কোর্সে ভর্তি নেওয়া হয়। বিস্তারিত জানতে নির্দিষ্ট কোর্সের পাতা দেখুন অথবা আমাদের সাথে যোগাযোগ করুন।",
      },
      {
        q: "ভর্তির জন্য কিভাবে আবেদন করব?",
        a: "আমাদের ওয়েবসাইটে কোর্স নির্বাচন করুন, তারপর ফোন বা ইমেইলে যোগাযোগ করুন। প্রয়োজনীয় কাগজপত্রসহ আবেদন ফর্ম পূরণ করে জমা দিন।",
      },
      {
        q: "ভর্তি ফি কত?",
        a: "বেশিরভাগ কোর্স সম্পূর্ণ বিনামূল্যে। কিছু কোর্সে ভর্তি ফি থাকলেও স্কলারশিপের মাধ্যমে ১০০% পর্যন্ত মওকুফ করা হয়।",
      },
      {
        q: "কোন কোন কাগজপত্র লাগবে?",
        a: "জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন, সর্বশেষ শিক্ষাগত সনদ, পাসপোর্ট সাইজ ছবি (২ কপি), অভিভাবকের NID ফটোকপি এবং স্থানীয় প্রত্যয়নপত্র।",
      },
    ],
  },
  {
    key: "courses",
    label: "কোর্স সংক্রান্ত",
    icon: <BookIcon size={16} color="var(--color-primary-500)" />,
    questions: [
      {
        q: "কোর্সের সময়কাল কত?",
        a: "কোর্সভেদে ১ মাস থেকে ৪ মাস পর্যন্ত। ড্রাইভিং ট্রেনিং ১ মাস, স্মল বিজনেস ম্যানেজমেন্ট ৩ মাস, শেফ ট্রেনিং ৪ মাস।",
      },
      {
        q: "প্রশিক্ষণ কি রেসিডেন্সিয়াল?",
        a: "হ্যাঁ, বেশিরভাগ কোর্স রেসিডেন্সিয়াল — থাকা, খাওয়া ও প্রশিক্ষণ সব এক জায়গায়। এতে শিক্ষার্থীরা সম্পূর্ণ মনোযোগ দিয়ে শিখতে পারেন।",
      },
      {
        q: "সার্টিফিকেট পাওয়া যায়?",
        a: "হ্যাঁ, সফলভাবে কোর্স সম্পন্ন করলে জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA) স্বীকৃত সনদপত্র প্রদান করা হয়।",
      },
      {
        q: "নারীদের জন্য কি পৃথক ব্যবস্থা আছে?",
        a: "হ্যাঁ, নারী ও পুরুষের জন্য সম্পূর্ণ পৃথক প্রশিক্ষণ ব্যবস্থা রয়েছে। স্মার্ট টেইলারিং কোর্সটি বিশেষভাবে নারীদের জন্য পরিচালিত হয়।",
      },
    ],
  },
  {
    key: "scholarship",
    label: "স্কলারশিপ",
    icon: <AwardIcon size={16} color="var(--color-primary-500)" />,
    questions: [
      {
        q: "স্কলারশিপ কিভাবে পাওয়া যায়?",
        a: "মেধা ও আর্থিক অবস্থার ভিত্তিতে স্কলারশিপ দেওয়া হয়। ভর্তির সময় স্কলারশিপের জন্য আবেদন করতে হয় এবং একটি মূল্যায়ন প্রক্রিয়ার মধ্য দিয়ে যেতে হয়।",
      },
      {
        q: "স্কলারশিপে কত টাকা পর্যন্ত মওকুফ হয়?",
        a: "আবাসন খরচে ১০০% পর্যন্ত এবং টিউশন ফি-তে ৮০% পর্যন্ত স্কলারশিপ সুবিধা রয়েছে। অনেক কোর্স সম্পূর্ণ বিনামূল্যে।",
      },
      {
        q: "স্কলারশিপের জন্য কোন শর্ত আছে?",
        a: "নিয়মিত উপস্থিতি, পরীক্ষায় উত্তীর্ণ হওয়া এবং প্রতিষ্ঠানের নিয়ম-কানুন মেনে চলা স্কলারশিপের শর্তের অন্তর্ভুক্ত।",
      },
    ],
  },
  {
    key: "general",
    label: "সাধারণ",
    icon: <UsersIcon size={16} color="var(--color-primary-500)" />,
    questions: [
      {
        q: "প্রতিষ্ঠানটি কি সরকার স্বীকৃত?",
        a: "হ্যাঁ, আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA) কর্তৃক নিবন্ধিত।",
      },
      {
        q: "জব প্লেসমেন্ট সুবিধা আছে কি?",
        a: "হ্যাঁ, প্রশিক্ষণ শেষে কর্মসংস্থান সহায়তা প্রদান করা হয়। বিভিন্ন কোম্পানি ও প্রতিষ্ঠানের সাথে আমাদের সংযোগ রয়েছে।",
      },
      {
        q: "ক্যাম্পাসের অবস্থান কোথায়?",
        a: "আমাদের ক্যাম্পাস উত্তর বাড্ডা, আলীনগর গেট সংলগ্ন, ঢাকায় অবস্থিত। প্রশিক্ষণ কেন্দ্রটি ২৪,০০০ বর্গফুট জায়গায় অবস্থিত।",
      },
    ],
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("admission");
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = faqCategories.find((c) => c.key === activeCategory);
  const filteredQuestions = searchQuery
    ? faqCategories.flatMap((c) =>
        c.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : currentCategory?.questions || [];

  return (
    <>
      <PageHeader
        badge="সাধারণ জিজ্ঞাসা"
        badgeIcon={<ChatIcon size={14} color="var(--color-secondary-400)" />}
        title="সাধারণ"
        titleHighlight="জিজ্ঞাসা"
        subtitle="আমাদের সম্পর্কে প্রায়শই জিজ্ঞাসিত প্রশ্ন ও উত্তর"
        breadcrumbs={[{ label: "সাধারণ জিজ্ঞাসা" }]}
      />

      <section className={`section ${styles.faqSection}`}>
        <div className="container">
          {/* Search */}
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="প্রশ্ন খুঁজুন..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          {!searchQuery && (
            <div className={styles.categoryTabs}>
              {faqCategories.map((cat) => (
                <button
                  key={cat.key}
                  className={`${styles.categoryTab} ${activeCategory === cat.key ? styles.categoryTabActive : ""}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* FAQ List */}
          <div className={styles.faqList}>
            <Accordion>
              {filteredQuestions.map((q, i) => (
                <AccordionItem key={i} title={q.q} defaultOpen={i === 0}>
                  <p>{q.a}</p>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredQuestions.length === 0 && (
              <div className={styles.noResults}>
                <p>কোনো ফলাফল পাওয়া যায়নি। অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
