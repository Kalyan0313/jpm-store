'use client';

import { useState } from 'react';
import styles from './ProductAccordion.module.css';

export default function ProductAccordion({ sections = [] }) {
    const [openIdx, setOpenIdx] = useState(0);

    const toggle = (i) => setOpenIdx(openIdx === i ? -1 : i);

    return (
        <div className={styles.accordion}>
            {sections.map((section, i) => {
                const isOpen = openIdx === i;
                return (
                    <div key={i} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
                        <button
                            className={styles.trigger}
                            onClick={() => toggle(i)}
                            aria-expanded={isOpen}
                        >
                            <span>{section.title}</span>
                            <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                        </button>
                        <div
                            className={styles.panel}
                            style={{ maxHeight: isOpen ? '400px' : '0' }}
                            aria-hidden={!isOpen}
                        >
                            <div className={styles.panelInner}>
                                {section.content.split('\n').map((line, j) => (
                                    <p key={j} className={styles.line}>{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
