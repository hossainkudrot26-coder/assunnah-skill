"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { mainNav, type NavItem } from "@/config/navigation";
import {
  BookIcon, BriefcaseIcon, ChefHatIcon, ChartIcon, ScissorsIcon,
  ClipboardIcon, AwardIcon, ChatIcon, BuildingIcon, CameraIcon,
  MessageCircleIcon, MegaphoneIcon, PhoneIcon, MailIcon, ShieldCheckIcon,
  ArrowRightIcon,
} from "@/shared/components/Icons";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import styles from "./Header.module.css";

const iconMap: Record<string, (s: number, c: string) => React.ReactNode> = {
  book: (s, c) => <BookIcon size={s} color={c} />,
  briefcase: (s, c) => <BriefcaseIcon size={s} color={c} />,
  chef: (s, c) => <ChefHatIcon size={s} color={c} />,
  chart: (s, c) => <ChartIcon size={s} color={c} />,
  scissors: (s, c) => <ScissorsIcon size={s} color={c} />,
  clipboard: (s, c) => <ClipboardIcon size={s} color={c} />,
  award: (s, c) => <AwardIcon size={s} color={c} />,
  chat: (s, c) => <ChatIcon size={s} color={c} />,
  building: (s, c) => <BuildingIcon size={s} color={c} />,
  camera: (s, c) => <CameraIcon size={s} color={c} />,
  message: (s, c) => <MessageCircleIcon size={s} color={c} />,
  megaphone: (s, c) => <MegaphoneIcon size={s} color={c} />,
};

export function Header() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const renderDropdownItem = (item: NavItem) => {
    const renderIcon = item.iconName ? iconMap[item.iconName] : null;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={styles.dropdownItem}
        onClick={() => setActiveDropdown(null)}
      >
        {renderIcon && (
          <span className={styles.dropdownItemIcon}>
            {renderIcon(18, "var(--color-primary-500)")}
          </span>
        )}
        <span className={styles.dropdownItemText}>
          <span className={styles.dropdownItemLabel}>{item.label}</span>
          {item.description && (
            <span className={styles.dropdownItemDesc}>{item.description}</span>
          )}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topBarLeft}>
            <a href="tel:+8809610001089" className={styles.topBarItem}>
              <PhoneIcon size={12} color="currentColor" />
              +৮৮০ ৯৬১০-০০১০৮৯
            </a>
            <a href="mailto:skill@assunnahfoundation.org" className={styles.topBarItem}>
              <MailIcon size={12} color="currentColor" />
              skill@assunnahfoundation.org
            </a>
          </div>
          <div className={styles.topBarRight}>
            <span className={styles.topBarBadge}>
              <ShieldCheckIcon size={12} color="currentColor" />
              NSDA নিবন্ধিত
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/logo-real.png"
              alt="আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট"
              width={160}
              height={40}
              className={styles.logoImage}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="প্রধান নেভিগেশন">
            {mainNav.map((item) => (
              <div
                key={item.label}
                className={styles.navItem}
                onMouseEnter={() => item.children ? handleDropdownEnter(item.label) : undefined}
                onMouseLeave={item.children ? handleDropdownLeave : undefined}
              >
                <Link href={item.href} className={styles.navLink}>
                  <span className={styles.navLinkText}>{item.label}</span>
                  {item.children && (
                    <svg
                      className={`${styles.navChevron} ${activeDropdown === item.label ? styles.navChevronOpen : ""}`}
                      width="10" height="10" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div
                    className={`${styles.dropdown} ${activeDropdown === item.label ? styles.dropdownOpen : ""}`}
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className={styles.dropdownInner}>
                      {item.children.map(renderDropdownItem)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <Link href={isLoggedIn ? "/hub" : "/login"} className={styles.ctaBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {isLoggedIn ? "ড্যাশবোর্ড" : "কমিউনিটি"}
            </Link>

            {/* Mobile Toggle */}
            <button
              className={`${styles.menuToggle} hide-desktop`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="মেনু খুলুন" aria-expanded={menuOpen}
            >
              <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen : ""}`} />
              <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen : ""}`} />
              <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Mobile Panel */}
        <div className={`${styles.mobilePanel} ${menuOpen ? styles.mobilePanelOpen : ""}`}>
          <div className={styles.mobilePanelHeader}>
            <Image
              src="/images/logo-real.png"
              alt="আস-সুন্নাহ স্কিল"
              width={140}
              height={35}
              className={styles.logoImage}
            />
            <button className={styles.mobileClose} onClick={() => setMenuOpen(false)} aria-label="মেনু বন্ধ করুন">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className={styles.mobileNav} aria-label="মোবাইল নেভিগেশন">
            {mainNav.map((item) => (
              <div key={item.label} className={styles.mobileNavGroup}>
                {item.children ? (
                  <>
                    <button
                      className={styles.mobileNavLink}
                      onClick={() =>
                        setMobileAccordion(
                          mobileAccordion === item.label ? null : item.label
                        )
                      }
                    >
                      {item.label}
                      <svg
                        className={`${styles.mobileChevron} ${mobileAccordion === item.label ? styles.mobileChevronOpen : ""}`}
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>
                    <div
                      className={`${styles.mobileAccordionContent} ${mobileAccordion === item.label ? styles.mobileAccordionOpen : ""}`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={styles.mobileSubLink}
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.iconName && iconMap[child.iconName] && (
                            <span className={styles.mobileSubIcon}>
                              {iconMap[child.iconName]!(15, "var(--color-primary-500)")}
                            </span>
                          )}
                          <span>
                            <span className={styles.mobileSubLabel}>{child.label}</span>
                            {child.description && (
                              <span className={styles.mobileSubDesc}>{child.description}</span>
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className={styles.mobilePanelFooter}>
            <Link href={isLoggedIn ? "/hub" : "/login"} className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
              {isLoggedIn ? "ড্যাশবোর্ডে যান" : "কমিউনিটিতে যোগ দিন"}
            </Link>
            <div className={styles.mobileContact}>
              <a href="tel:+8809610001089">+৮৮০ ৯৬১০-০০১০৮৯</a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
