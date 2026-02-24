"use client";

import { motion } from "framer-motion";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle?: string;
  dark?: boolean;
  align?: "center" | "left";
}

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function SectionHeader({
  badge,
  badgeIcon,
  title,
  titleHighlight,
  titleSuffix,
  subtitle,
  dark = false,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`${styles.sectionHeader} ${align === "left" ? styles.alignLeft : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div
        className={`${styles.badge} ${dark ? styles.badgeDark : ""}`}
        variants={fadeUp}
      >
        {badgeIcon}
        <span>{badge}</span>
      </motion.div>
      <motion.h2 className="heading-md" variants={fadeUp}>
        {title}{" "}
        {titleHighlight && (
          <span className="gradient-text">{titleHighlight}</span>
        )}
        {titleSuffix && <> {titleSuffix}</>}
      </motion.h2>
      {subtitle && (
        <motion.p
          className={`${styles.subtitle} ${dark ? styles.subtitleDark : ""}`}
          variants={fadeUp}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
