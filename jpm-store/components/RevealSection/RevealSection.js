'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

/**
 * RevealSection — wraps any section so it fades+slides up when scrolled into view.
 *
 * Props:
 *  - className: string (extra class)
 *  - direction: 'up' | 'left' | 'right' | 'scale' (default 'up')
 *  - delay: 0-6 (adds .delay-N class)
 *  - tag: HTML tag to render (default 'div')
 */
export default function RevealSection({
    children,
    className = '',
    direction = 'up',
    delay = 0,
    tag: Tag = 'div',
}) {
    const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

    const baseClass = {
        up: 'reveal',
        left: 'reveal-left',
        right: 'reveal-right',
        scale: 'reveal-scale',
    }[direction] ?? 'reveal';

    const delayClass = delay > 0 ? `delay-${delay}` : '';

    return (
        <Tag
            ref={ref}
            className={`${baseClass} ${isVisible ? 'visible' : ''} ${delayClass} ${className}`.trim()}
        >
            {children}
        </Tag>
    );
}
