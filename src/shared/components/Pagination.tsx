"use client";

import styles from "./Pagination.module.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage = 20,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(currentPage, totalPages);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = totalItems
        ? Math.min(currentPage * itemsPerPage, totalItems)
        : currentPage * itemsPerPage;

    return (
        <div className={styles.paginationWrap}>
            {totalItems !== undefined && (
                <span className={styles.info}>
                    {startItem}–{endItem} / মোট {totalItems}
                </span>
            )}
            <div className={styles.buttons}>
                <button
                    className={styles.btn}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="আগের পেজ"
                >
                    ‹
                </button>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`dot-${i}`} className={styles.dots}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            className={`${styles.btn} ${currentPage === p ? styles.active : ""}`}
                            onClick={() => onPageChange(p as number)}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    className={styles.btn}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="পরের পেজ"
                >
                    ›
                </button>
            </div>
        </div>
    );
}

/** Smart page number generator — shows first, last, and nearby pages with ellipsis */
function getPageNumbers(
    current: number,
    total: number
): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "...")[] = [];

    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");

    pages.push(total);

    return pages;
}
