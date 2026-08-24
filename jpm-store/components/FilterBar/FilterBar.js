'use client';

import { useRouter } from 'next/navigation';
import styles from './FilterBar.module.css';

const SORT_OPTIONS = [
    { value: 'default', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'discount', label: 'Best Discount' },
];

export default function FilterBar({ currentSort, slug }) {
    const router = useRouter();

    const handleSort = (e) => {
        const val = e.target.value;
        const params = new URLSearchParams();
        if (val !== 'default') params.set('sort', val);
        params.set('page', '1');
        router.push(`/category/${slug}?${params.toString()}`);
    };

    return (
        <div className={styles.bar}>
            <span className={styles.label}>Sort by:</span>
            <div className={styles.selectWrap}>
                <select
                    className={styles.select}
                    value={currentSort}
                    onChange={handleSort}
                    aria-label="Sort products"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <span className={styles.selectArrow}>▾</span>
            </div>
        </div>
    );
}
