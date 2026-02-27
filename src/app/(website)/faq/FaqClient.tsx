"use client";

import { useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import { Accordion, AccordionItem } from "@/shared/components/Accordion";
import {
    ChatIcon, BookIcon, AwardIcon, ClipboardIcon, UsersIcon,
} from "@/shared/components/Icons";
import styles from "./faq.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface FaqCategory {
    key: string;
    label: string;
    iconKey: string;
    questions: { q: string; a: string }[];
}

interface FaqClientProps {
    categories: FaqCategory[];
}

/* ═══════════════════════════════════════════
   ICON MAP (for serializable icon keys)
   ═══════════════════════════════════════════ */

const iconMap: Record<string, React.ReactNode> = {
    clipboard: <ClipboardIcon size={16} color="var(--color-primary-500)" />,
    book: <BookIcon size={16} color="var(--color-primary-500)" />,
    award: <AwardIcon size={16} color="var(--color-primary-500)" />,
    users: <UsersIcon size={16} color="var(--color-primary-500)" />,
    chat: <ChatIcon size={16} color="var(--color-primary-500)" />,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function FaqClient({ categories }: FaqClientProps) {
    const [activeCategory, setActiveCategory] = useState(categories[0]?.key || "");
    const [searchQuery, setSearchQuery] = useState("");

    const currentCategory = categories.find((c) => c.key === activeCategory);
    const filteredQuestions = searchQuery
        ? categories.flatMap((c) =>
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
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    className={`${styles.categoryTab} ${activeCategory === cat.key ? styles.categoryTabActive : ""}`}
                                    onClick={() => setActiveCategory(cat.key)}
                                >
                                    {iconMap[cat.iconKey] || iconMap.chat}
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
