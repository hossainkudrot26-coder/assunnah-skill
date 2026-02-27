"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * WCAG 2.1 compliant modal behavior hook.
 *
 * Features:
 * - Focus trap inside the modal
 * - Escape key to close
 * - Restores focus to trigger element on close
 * - Prevents body scroll when open
 *
 * Usage:
 * ```tsx
 * const { modalRef, modalProps } = useAccessibleModal({
 *   isOpen: showModal,
 *   onClose: () => setShowModal(false),
 *   ariaLabel: "কোর্স সম্পাদনা",
 * });
 *
 * {showModal && (
 *   <div role="dialog" {...modalProps} ref={modalRef}>
 *     ...
 *   </div>
 * )}
 * ```
 */
export function useAccessibleModal({
    isOpen,
    onClose,
    ariaLabel,
}: {
    isOpen: boolean;
    onClose: () => void;
    ariaLabel: string;
}) {
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    // Store the element that opened the modal
    useEffect(() => {
        if (isOpen) {
            triggerRef.current = document.activeElement as HTMLElement;
            // Prevent body scroll
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            // Restore focus to trigger
            triggerRef.current?.focus();
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Focus first focusable element inside modal
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length > 0) {
            // Small delay to let the modal render
            requestAnimationFrame(() => focusable[0].focus());
        }
    }, [isOpen]);

    // Escape key + focus trap
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen || !modalRef.current) return;

            if (e.key === "Escape") {
                onClose();
                return;
            }

            // Focus trap
            if (e.key === "Tab") {
                const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        [isOpen, onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const modalProps = {
        role: "dialog" as const,
        "aria-modal": true as const,
        "aria-label": ariaLabel,
    };

    return { modalRef, modalProps };
}
