import Link from 'next/link';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './NewArrivals.module.css';

export default function NewArrivals({ products = [] }) {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>New Arrivals</h2>
                        <p className={styles.subtitle}>Hot off the shelf — just landed</p>
                    </div>
                    <Link href="/category/mobiles" className={`btn btn-outline ${styles.viewAllBtn}`}>
                        View All
                    </Link>
                </div>

                {/* Horizontal scrollable row */}
                <div className={styles.row}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.cardSlot}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
