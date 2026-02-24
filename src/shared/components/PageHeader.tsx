"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./PageHeader.module.css";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  badge?: string | { icon?: React.ReactNode; text: string };
  badgeIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const ease = [0.22, 1, 0.36, 1] as const;
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };

export function PageHeader({ title, titleHighlight, subtitle, breadcrumbs, badge, badgeIcon, children }: PageHeaderProps) {
  const badgeText = typeof badge === "string" ? badge : badge?.text;
  const badgeIconNode = typeof badge === "string" ? badgeIcon : badge?.icon;

  return (
    <section className={styles.pageHeader}>
      <div className={styles.bgPattern} />
      <div className={styles.bgGlow} />

      <motion.div
        className={`container ${styles.content}`}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {breadcrumbs && (
          <motion.nav className={styles.breadcrumbs} variants={fadeUp} aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className={styles.breadcrumbItem}>
                {i > 0 && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.breadcrumbSep}>
                    <polyline points="9,6 15,12 9,18" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className={styles.breadcrumbLink}>{crumb.label}</Link>
                ) : (
                  <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {badgeText && (
          <motion.div className={styles.badge} variants={fadeUp}>
            {badgeIconNode}
            <span>{badgeText}</span>
          </motion.div>
        )}

        <motion.h1 className={styles.title} variants={fadeUp}>
          {title}
          {titleHighlight && (
            <>
              {" "}
              <span className={styles.titleHighlight}>{titleHighlight}</span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p className={styles.subtitle} variants={fadeUp}>{subtitle}</motion.p>
        )}

        {children && (
          <motion.div className={styles.extra} variants={fadeUp}>{children}</motion.div>
        )}
      </motion.div>

      <div className={styles.wave}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
