"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Accordion.module.css";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  icon,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.triggerLeft}>
          {icon && <span className={styles.triggerIcon}>{icon}</span>}
          <span className={styles.triggerTitle}>{title}</span>
        </div>
        <svg
          className={styles.chevron}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>
      <div
        className={styles.content}
        style={{ maxHeight: isOpen ? `${height}px` : "0px" }}
      >
        <div ref={contentRef} className={styles.contentInner}>
          {children}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
}

export function Accordion({ children }: AccordionProps) {
  return <div className={styles.accordion}>{children}</div>;
}
