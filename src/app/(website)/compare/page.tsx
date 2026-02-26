"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/config/courses";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  ArrowRightIcon, CheckCircleIcon, XIcon, LayersIcon,
  ClockIcon, UsersIcon, AwardIcon, CalendarIcon,
  GraduationIcon, BriefcaseIcon, ChefHatIcon, ChartIcon,
  ScissorsIcon, ShoeIcon, CarIcon,
} from "@/shared/components/Icons";
import styles from "./compare.module.css";

const iconMap: Record<string, (s: number, c: string) => React.ReactNode> = {
  BriefcaseIcon: (s, c) => <BriefcaseIcon size={s} color={c} />,
  ChefHatIcon: (s, c) => <ChefHatIcon size={s} color={c} />,
  ChartIcon: (s, c) => <ChartIcon size={s} color={c} />,
  ScissorsIcon: (s, c) => <ScissorsIcon size={s} color={c} />,
  ShoeIcon: (s, c) => <ShoeIcon size={s} color={c} />,
  CarIcon: (s, c) => <CarIcon size={s} color={c} />,
};

const MAX_COMPARE = 3;

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCourse = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < MAX_COMPARE
          ? [...prev, slug]
          : prev
    );
  };

  const removeCourse = (slug: string) => {
    setSelected((prev) => prev.filter((s) => s !== slug));
  };

  const selectedCourses = courses.filter((c) => selected.includes(c.slug));

  const comparisonRows = [
    { label: "সময়কাল", key: "duration" as const, icon: <ClockIcon size={16} color="var(--color-neutral-400)" /> },
    { label: "ধরন", key: "type" as const, icon: <CalendarIcon size={16} color="var(--color-neutral-400)" /> },
    { label: "ক্যাটেগরি", key: "category" as const, icon: <UsersIcon size={16} color="var(--color-neutral-400)" /> },
    { label: "ভর্তি ফি", key: "feeAdmission" as const, icon: <AwardIcon size={16} color="var(--color-neutral-400)" /> },
    { label: "মোট খরচ", key: "feeTotal" as const, icon: <AwardIcon size={16} color="var(--color-neutral-400)" /> },
    { label: "স্কলারশিপ", key: "feeScholarship" as const, icon: <GraduationIcon size={16} color="var(--color-neutral-400)" /> },
    { label: "মডিউল সংখ্যা", key: "modules" as const, icon: <LayersIcon size={16} color="var(--color-neutral-400)" /> },
  ];

  type RowKey = (typeof comparisonRows)[number]["key"];

  const getValue = (c: typeof courses[0], key: RowKey): string => {
    switch (key) {
      case "duration": return c.duration;
      case "type": return c.type;
      case "category": return c.category;
      case "feeAdmission": return c.fee.admission;
      case "feeTotal": return c.fee.total;
      case "feeScholarship": return c.fee.scholarship;
      case "modules": return `${c.syllabus.length}টি মডিউল`;
      default: return "";
    }
  };

  return (
    <>
      <PageHeader
        title="কোর্স তুলনা"
        subtitle="পাশাপাশি কোর্স তুলনা করুন — সময়কাল, ফি, সিলেবাস ও সুবিধা"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "কোর্স তুলনা" },
        ]}
        badge={{ icon: <LayersIcon size={14} color="var(--color-secondary-300)" />, text: "কোর্স তুলনা" }}
      />

      <section className={`section ${styles.compareSection}`}>
        <div className="container">
          {/* Course Selector */}
          <div className={styles.selectorWrap}>
            <h3 className={styles.selectorTitle}>
              তুলনার জন্য কোর্স বাছাই করুন (সর্বোচ্চ {MAX_COMPARE}টি)
            </h3>
            <div className={styles.selectorGrid}>
              {courses.map((c) => {
                const isSelected = selected.includes(c.slug);
                const isDisabled = !isSelected && selected.length >= MAX_COMPARE;
                const renderIcon = iconMap[c.iconName];
                return (
                  <button
                    key={c.slug}
                    className={`${styles.selectorCard} ${isSelected ? styles.selectorActive : ""} ${isDisabled ? styles.selectorDisabled : ""}`}
                    onClick={() => !isDisabled && toggleCourse(c.slug)}
                    disabled={isDisabled}
                  >
                    <div className={styles.selectorIcon} style={{ borderColor: `${c.color}30` }}>
                      {renderIcon ? renderIcon(20, c.color) : <GraduationIcon size={20} color={c.color} />}
                    </div>
                    <span className={styles.selectorName}>{c.title}</span>
                    {isSelected && (
                      <span className={styles.selectorCheck}>
                        <CheckCircleIcon size={16} color="var(--color-primary-500)" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          <AnimatePresence>
            {selectedCourses.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={styles.tableWrap}
              >
                <div className={styles.tableScroll}>
                  <table className={styles.compareTable}>
                    <thead>
                      <tr>
                        <th className={styles.labelCol}>বিষয়</th>
                        {selectedCourses.map((c) => (
                          <th key={c.slug} className={styles.courseCol}>
                            <button className={styles.removeBtn} onClick={() => removeCourse(c.slug)}>
                              <XIcon size={14} color="var(--color-neutral-400)" />
                            </button>
                            <div className={styles.courseColIcon} style={{ background: `${c.color}12` }}>
                              {iconMap[c.iconName] ? iconMap[c.iconName](22, c.color) : null}
                            </div>
                            <span className={styles.courseColName}>{c.title}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row.key}>
                          <td className={styles.rowLabel}>
                            {row.icon}
                            {row.label}
                          </td>
                          {selectedCourses.map((c) => (
                            <td key={c.slug} className={styles.rowValue}>
                              {getValue(c, row.key)}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* Outcomes row */}
                      <tr>
                        <td className={styles.rowLabel}>
                          <CheckCircleIcon size={16} color="var(--color-neutral-400)" />
                          ফলাফল
                        </td>
                        {selectedCourses.map((c) => (
                          <td key={c.slug} className={styles.rowOutcomes}>
                            <ul>
                              {c.outcomes.slice(0, 3).map((o, i) => (
                                <li key={i}>
                                  <CheckCircleIcon size={12} color="var(--color-primary-500)" />
                                  {o}
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                      {/* Action row */}
                      <tr>
                        <td className={styles.rowLabel}></td>
                        {selectedCourses.map((c) => (
                          <td key={c.slug} className={styles.rowAction}>
                            <Link href={`/courses/${c.slug}`} className={styles.viewBtn}>
                              বিস্তারিত
                              <ArrowRightIcon size={14} color="white" />
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedCourses.length < 2 && selected.length > 0 && (
            <p className={styles.hint}>তুলনা দেখতে আরো {2 - selected.length}টি কোর্স বাছাই করুন</p>
          )}
        </div>
      </section>
    </>
  );
}
