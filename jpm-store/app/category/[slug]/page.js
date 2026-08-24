import { fetchProductsByCategory } from '@/utils/api';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import FilterBar from '@/components/FilterBar/FilterBar';
import styles from './page.module.css';

const CATEGORY_MAP = {
    smartwatches: { slug: 'smartwatches', label: 'Smartwatches' },
    earphones: { slug: 'earphones', label: 'Earphones & Audio' },
    laptops: { slug: 'laptops', label: 'Laptops' },
    mobiles: { slug: 'mobiles', label: 'Mobiles' },
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const cat = CATEGORY_MAP[slug];
    const label = cat?.label ?? slug;
    return {
        title: `${label} — JPM Store`,
        description: `Shop the best ${label} at unbeatable prices on JPM Store.`,
    };
}

export default async function CategoryPage({ params, searchParams }) {
    const { slug } = await params;
    const resolvedSearch = await searchParams;
    const cat = CATEGORY_MAP[slug] || { slug, label: slug };

    // Pagination
    const page = Number(resolvedSearch?.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Sort & filter from search params
    const sortBy = resolvedSearch?.sort || 'default';

    let data;
    try {
        data = await fetchProductsByCategory(cat.slug, { limit: 100, skip: 0 });
    } catch {
        data = { products: [], total: 0 };
    }

    let products = [...(data.products || [])];

    if (sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'discount') products.sort((a, b) => b.discountPercentage - a.discountPercentage);

    const total = products.length;
    const paginated = products.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: cat.label },
    ];

    return (
        <div className={styles.page}>
            <div className="container">
                <Breadcrumb items={breadcrumbs} />

                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{cat.label}</h1>
                        <p className={styles.count}>{total} products</p>
                    </div>
                    <FilterBar currentSort={sortBy} slug={slug} />
                </div>

                <ProductGrid products={paginated} />

                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        slug={slug}
                        sortBy={sortBy}
                    />
                )}
            </div>
        </div>
    );
}

function Pagination({ currentPage, totalPages, slug, sortBy }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const sortParam = sortBy !== 'default' ? `&sort=${sortBy}` : '';

    return (
        <nav className={styles.pagination} aria-label="Pagination">
            {pages.map((p) => (
                <a
                    key={p}
                    href={`/category/${slug}?page=${p}${sortParam}`}
                    className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ''}`}
                    aria-current={p === currentPage ? 'page' : undefined}
                >
                    {p}
                </a>
            ))}
        </nav>
    );
}
