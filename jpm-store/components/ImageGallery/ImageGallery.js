'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ImageGallery.module.css';

export default function ImageGallery({ images = [], title }) {
    const [activeIdx, setActiveIdx] = useState(0);

    const validImages = images.filter(Boolean);
    if (validImages.length === 0) return null;

    const prev = () => setActiveIdx((i) => (i - 1 + validImages.length) % validImages.length);
    const next = () => setActiveIdx((i) => (i + 1) % validImages.length);

    return (
        <div className={styles.gallery}>
            {/* Main image */}
            <div className={styles.mainWrap}>
                {validImages.length > 1 && (
                    <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous image">‹</button>
                )}
                <Image
                    key={activeIdx}
                    src={validImages[activeIdx]}
                    alt={`${title} — image ${activeIdx + 1}`}
                    width={560}
                    height={560}
                    priority
                    className={styles.mainImage}
                />
                {validImages.length > 1 && (
                    <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next image">›</button>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className={styles.thumbs}>
                    {validImages.map((src, i) => (
                        <button
                            key={i}
                            className={`${styles.thumb} ${i === activeIdx ? styles.thumbActive : ''}`}
                            onClick={() => setActiveIdx(i)}
                            aria-label={`View image ${i + 1}`}
                        >
                            <Image src={src} alt={`${title} thumbnail ${i + 1}`} width={72} height={72} className={styles.thumbImg} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
