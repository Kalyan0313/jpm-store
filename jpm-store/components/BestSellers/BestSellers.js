'use client';

import { useState, useRef } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './BestSellers.module.css';

const TABS = [
    { key: 'smartwatches', label: 'Smartwatches' },
    { key: 'earphones', label: 'Earphones' },
    { key: 'laptops', label: 'Laptops' },
    { key: 'mobiles', label: 'Mobiles' },
];

export default function BestSellers({ allProducts }) {
    const [activeTab, setActiveTab] = useState('smartwatches');
    const scrollRef = useRef(null);

    const products = allProducts[activeTab] || [];

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = 320;
        el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Best Sellers</h2>
                        <p className={styles.subtitle}>Top-rated products customers love</p>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs} role="tablist">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                role="tab"
                                aria-selected={activeTab === tab.key}
                                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scroll area */}
                <div className={styles.sliderWrapper}>
                    <button
                        className={`${styles.scrollBtn} ${styles.scrollLeft}`}
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>

                    <div className={styles.slider} ref={scrollRef} role="tabpanel">
                        {products.length === 0 ? (
                            <div className={styles.empty}>No products found</div>
                        ) : (
                            products.map((product) => (
                                <div key={product.id} className={styles.cardSlot}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        className={`${styles.scrollBtn} ${styles.scrollRight}`}
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
