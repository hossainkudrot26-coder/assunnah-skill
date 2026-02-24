import styles from "./Badge.module.css";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "dark" | "outline";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  icon,
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${styles[size]}`}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
}
