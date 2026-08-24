'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — attaches an IntersectionObserver to trigger CSS animations
 * when an element scrolls into view.
 *
 * @param {object} options
 * @param {number} options.threshold  — 0 to 1, fraction of element visible to trigger (default 0.15)
 * @param {string} options.rootMargin — IntersectionObserver rootMargin  (default '0px')
 * @returns {{ ref, isVisible }}
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px' } = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el); // Only trigger once
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return { ref, isVisible };
}
