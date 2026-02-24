import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingWrap}>
      {/* Header skeleton */}
      <div className={styles.headerSkeleton}>
        <div className={styles.headerContent}>
          <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeleton} ${styles.skeletonSubtitle}`} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className={styles.contentSkeleton}>
        <div className={styles.contentInner}>
          <div className={styles.gridSkeleton}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonCard}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
