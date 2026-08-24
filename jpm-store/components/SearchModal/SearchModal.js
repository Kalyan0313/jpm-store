'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineSearch, HiX } from 'react-icons/hi';
import { searchProducts, formatPrice, getDiscountedPrice } from '@/utils/api';
import styles from './SearchModal.module.css';

const SUGGESTIONS = ['Smartwatch', 'iPhone', 'MacBook', 'Laptop', 'Earphones', 'Samsung'];

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const debouncedQuery = useDebounce(query, 400);

    // Focus input when opening
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Search when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        searchProducts(debouncedQuery, { limit: 8 })
            .then((data) => setResults(data.products || []))
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleSuggestion = (s) => setQuery(s);

    return (
        <div
            className={`${styles.modal} ${isOpen ? styles.open : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
        >
            {/* Search input */}
            <div className={styles.inputWrap}>
                <HiOutlineSearch className={styles.searchIcon} />
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products…"
                    className={styles.input}
                    aria-label="Search products"
                />
                {query && (
                    <button className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear search">
                        <HiX />
                    </button>
                )}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
                    ESC
                </button>
            </div>

            {/* Body */}
            <div className={styles.body}>
                {!query && (
                    <div className={styles.suggestions}>
                        <p className={styles.suggestLabel}>Popular Searches</p>
                        <div className={styles.chips}>
                            {SUGGESTIONS.map((s) => (
                                <button key={s} className={styles.chip} onClick={() => handleSuggestion(s)}>{s}</button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <span>Searching…</span>
                    </div>
                )}

                {!loading && query && results.length === 0 && (
                    <div className={styles.noResults}>
                        <p>No results for <strong>"{query}"</strong></p>
                        <p className={styles.noResultsHint}>Try different keywords or browse our categories.</p>
                    </div>
                )}

                {results.length > 0 && (
                    <div className={styles.results}>
                        <p className={styles.resultsLabel}>{results.length} results for "{query}"</p>
                        {results.map((product) => {
                            const discounted = getDiscountedPrice(product.price, product.discountPercentage);
                            return (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className={styles.result}
                                    onClick={onClose}
                                >
                                    <div className={styles.resultImage}>
                                        <Image src={product.thumbnail} alt={product.title} width={56} height={56} className={styles.resultImg} />
                                    </div>
                                    <div className={styles.resultInfo}>
                                        <p className={styles.resultTitle}>{product.title}</p>
                                        <p className={styles.resultCategory}>{product.category}</p>
                                    </div>
                                    <div className={styles.resultPrice}>
                                        {formatPrice(parseFloat(discounted))}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
