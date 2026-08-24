import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoryGrid.module.css';

const CATEGORIES = [
    {
        slug: 'smartwatches',
        label: 'Smartwatches',
        description: 'Track & perform',
        image: 'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp',
        color: '#4f8ef7',
        bg: 'linear-gradient(135deg, #0f2044 0%, #1a3a7a 100%)',
    },
    {
        slug: 'earphones',
        label: 'Earphones',
        description: 'Immersive audio',
        image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp',
        color: '#a855f7',
        bg: 'linear-gradient(135deg, #1a0a2e 0%, #3d1a6e 100%)',
    },
    {
        slug: 'laptops',
        label: 'Laptops',
        description: 'Power & speed',
        image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp',
        color: '#22c55e',
        bg: 'linear-gradient(135deg, #0a2e0a 0%, #1a5e2e 100%)',
    },
    {
        slug: 'mobiles',
        label: 'Mobiles',
        description: 'Stay connected',
        image: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp',
        color: '#f59e0b',
        bg: 'linear-gradient(135deg, #1f1000 0%, #4a2800 100%)',
    },
];

export default function CategoryGrid() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Shop by Category</h2>
                    <p className={styles.subtitle}>Find exactly what you're looking for</p>
                </div>

                <div className={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.slug} href={`/category/${cat.slug}`} className={styles.card}>
                            {/* Background */}
                            <div className={styles.cardBg} style={{ background: cat.bg }} />

                            {/* Glow */}
                            <div
                                className={styles.cardGlow}
                                style={{ background: `radial-gradient(circle at 50% 100%, ${cat.color}25 0%, transparent 70%)` }}
                            />

                            {/* Content */}
                            <div className={styles.cardContent}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src={cat.image}
                                        alt={cat.label}
                                        width={140}
                                        height={140}
                                        className={styles.catImage}
                                    />
                                </div>
                                <div className={styles.cardText}>
                                    <div
                                        className={styles.cardDot}
                                        style={{ background: cat.color }}
                                    />
                                    <h3 className={styles.cardLabel}>{cat.label}</h3>
                                    <p className={styles.cardDesc}>{cat.description}</p>
                                </div>
                            </div>

                            {/* Hover arrow */}
                            <div
                                className={styles.cardArrow}
                                style={{ color: cat.color }}
                            >
                                →
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
