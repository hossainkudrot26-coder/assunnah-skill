import styles from "./loading.module.css";

export default function AdminLoading() {
    return (
        <div className={styles.loadingContainer}>
            {/* Header skeleton */}
            <div className={styles.headerSkeleton}>
                <div className={styles.titleSkeleton}>
                    <div className={`${styles.skeleton} ${styles.skTitle}`} />
                    <div className={`${styles.skeleton} ${styles.skSubtitle}`} />
                </div>
                <div className={`${styles.skeleton} ${styles.skButton}`} />
            </div>

            {/* Filter bar skeleton */}
            <div className={styles.filterSkeleton}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.skFilter}`} />
                ))}
            </div>

            {/* Card skeletons */}
            <div className={styles.cardsSkeleton}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.cardSkeleton}>
                        <div className={styles.cardTopSkeleton}>
                            <div>
                                <div className={`${styles.skeleton} ${styles.skCardTitle}`} />
                                <div className={`${styles.skeleton} ${styles.skCardMeta}`} />
                            </div>
                            <div className={`${styles.skeleton} ${styles.skBadge}`} />
                        </div>
                        <div className={`${styles.skeleton} ${styles.skDesc}`} />
                        <div className={`${styles.skeleton} ${styles.skDescShort}`} />
                        <div className={styles.cardBottomSkeleton}>
                            <div className={`${styles.skeleton} ${styles.skStat}`} />
                            <div className={styles.skActions}>
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className={`${styles.skeleton} ${styles.skAction}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
