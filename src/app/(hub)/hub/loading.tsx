import styles from "./loading.module.css";

export default function HubLoading() {
    return (
        <div className={styles.loadingWrap}>
            {/* Welcome skeleton */}
            <div className={styles.welcomeSkeleton}>
                <div className={`${styles.skeleton} ${styles.skAvatar}`} />
                <div>
                    <div className={`${styles.skeleton} ${styles.skTitle}`} />
                    <div className={`${styles.skeleton} ${styles.skSubtitle}`} />
                </div>
            </div>

            {/* Stats skeleton */}
            <div className={styles.statsSkeleton}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.skStat}`} />
                ))}
            </div>

            {/* Cards skeleton */}
            <div className={styles.cardsSkeleton}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.skCard}`} />
                ))}
            </div>
        </div>
    );
}
