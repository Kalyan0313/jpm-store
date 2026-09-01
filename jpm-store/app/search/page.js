import { searchProducts } from '@/utils/api';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import styles from './page.module.css';

export async function generateMetadata({ searchParams }) {
    const q = searchParams?.q || '';
    return {
        title: q ? `"${q}" — Search — JPM Store` : 'Search — JPM Store',
    };
}

export default async function SearchPage({ searchParams }) {
    const query = searchParams?.q?.trim() || '';

    let results = [];
    let error = false;

    if (query) {
        try {
            const data = await searchProducts(query, { limit: 24 });
            results = data.products || [];
        } catch {
            error = true;
        }
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    {query ? (
                        <>
                            <h1 className={styles.title}>
                                {results.length > 0
                                    ? `${results.length} results for`
                                    : 'No results for'}
                                {' '}
                                <span className={styles.query}>&quot;{query}&quot;</span>
                            </h1>
                            {results.length === 0 && !error && (
                                <p className={styles.hint}>Try checking your spelling or using more general terms.</p>
                            )}
                        </>
                    ) : (
                        <h1 className={styles.title}>Search Products</h1>
                    )}

                    {error && (
                        <p className={styles.error}>Something went wrong. Please try again later.</p>
                    )}
                </div>

                {results.length > 0 && <ProductGrid products={results} />}
            </div>
        </div>
    );
}
