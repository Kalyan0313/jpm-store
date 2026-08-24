import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products = [] }) {
    if (products.length === 0) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyIcon}>📦</p>
                <p className={styles.emptyTitle}>No products found</p>
                <p className={styles.emptyDesc}>Try a different category or check back soon.</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
