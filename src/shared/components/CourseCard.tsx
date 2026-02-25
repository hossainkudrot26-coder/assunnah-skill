"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BriefcaseIcon, ChefHatIcon, ScissorsIcon, ChartIcon,
  CarIcon, ShoeIcon, ClockIcon, ArrowRightIcon, UsersIcon,
} from "@/shared/components/Icons";
import type { Course } from "@/config/courses";
import styles from "./CourseCard.module.css";

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  BriefcaseIcon, ChefHatIcon, ScissorsIcon, ChartIcon, CarIcon, ShoeIcon,
  LanguageIcon: BriefcaseIcon,
  CodeIcon: BriefcaseIcon,
  WrenchIcon: BriefcaseIcon,
  VideoIcon: BriefcaseIcon,
};

interface CourseCardProps {
  course: Course;
  variant?: "grid" | "featured";
  index?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function CourseCard({ course, variant = "grid", index = 0 }: CourseCardProps) {
  const Icon = iconMap[course.iconName];

  return (
    <motion.div
      className={`${styles.card} ${variant === "featured" ? styles.cardFeatured : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease, delay: index * 0.08 }}
    >
      <Link href={`/courses/${course.slug}`} className={styles.cardLink}>
        <div className={styles.cardGlow} style={{
          background: `radial-gradient(ellipse at top left, ${course.color}18, transparent 70%)`
        }} />

        <div className={styles.cardTop}>
          <div className={styles.iconWrap} style={{
            background: `${course.color}10`,
            borderColor: `${course.color}22`,
          }}>
            {Icon && <Icon size={24} color={course.color} />}
          </div>
          <span className={styles.typeBadge} style={{
            background: `${course.color}12`,
            color: course.color,
            borderColor: `${course.color}28`,
          }}>
            {course.type}
          </span>
        </div>

        {course.category && (
          <span className={styles.categoryBadge}>
            <UsersIcon size={12} color="var(--color-neutral-500)" />
            {course.category}
          </span>
        )}

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.desc}>{course.shortDesc}</p>

        <div className={styles.bottom}>
          <span className={styles.duration}>
            <ClockIcon size={14} color="var(--color-neutral-400)" />
            {course.duration}
          </span>
          <span className={styles.arrow}>
            বিস্তারিত
            <ArrowRightIcon size={13} />
          </span>
        </div>

        <div className={styles.borderGlow} style={{
          background: `linear-gradient(135deg, ${course.color}40, transparent, ${course.color}25)`,
        }} />
      </Link>
    </motion.div>
  );
}
