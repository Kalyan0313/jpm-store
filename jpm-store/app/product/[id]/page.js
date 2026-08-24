import { fetchProductById, fetchProductsByCategory, formatPrice, getDiscountedPrice } from '@/utils/api';
import ImageGallery from '@/components/ImageGallery/ImageGallery';
import ProductActions from '@/components/ProductActions/ProductActions';
import ProductAccordion from '@/components/ProductAccordion/ProductAccordion';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import styles from './page.module.css';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const product = await fetchProductById(id);
        return {
            title: `${product.title} — JPM Store`,
            description: product.description,
        };
    } catch {
        return { title: 'Product — JPM Store' };
    }
}

const CAT_LABEL_MAP = {
    smartwatches: 'Smartwatches',
    earphones: 'Earphones & Audio',
    laptops: 'Laptops',
    mobiles: 'Mobiles',
};

export default async function ProductPage({ params }) {
    const { id } = await params;
    let product;
    try {
        product = await fetchProductById(id);
    } catch {
        notFound();
    }

    // Related products from same category (exclude current)
    let relatedProducts = [];
    try {
        const related = await fetchProductsByCategory(product.category, { limit: 8 });
        relatedProducts = related.products.filter((p) => p.id !== product.id && p._id !== product._id).slice(0, 4);
    } catch { /* silently fail */ }

    const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
    const discount = Math.round(product.discountPercentage);

    const catSlug = product.category;
    const catLabel = CAT_LABEL_MAP[product.category] || product.category;

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: catLabel, href: `/category/${catSlug}` },
        { label: product.title },
    ];

    const accordionSections = [
        {
            title: 'Key Features',
            content: product.description,
        },
        {
            title: 'Specifications',
            content: `Brand: ${product.brand || 'N/A'}\nCategory: ${catLabel}\nStock: ${product.stock} available\nRating: ${product.rating || 'N/A'} / 5`,
        },
    ];

    return (
        <div className={styles.page}>
            <div className="container">
                <Breadcrumb items={breadcrumbs} />

                <div className={styles.layout}>
                    {/* Left: Image Gallery */}
                    <ImageGallery images={product.images && product.images.length > 0 ? product.images : [product.thumbnail]} title={product.title} />

                    {/* Right: Product Info */}
                    <div className={styles.infoPanel}>
                        {product.brand && <p className={styles.brand}>{product.brand}</p>}
                        <h1 className={styles.title}>{product.title}</h1>

                        {/* Rating */}
                        <div className={styles.ratingRow}>
                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <span key={s} className={s <= Math.round(product.rating || 5) ? styles.starFilled : styles.starEmpty}>★</span>
                                ))}
                            </div>
                            <span className={styles.ratingNum}>{product.rating?.toFixed(1) || '5.0'}</span>
                        </div>

                        {/* Price */}
                        <div className={styles.priceSection}>
                            <span className={styles.salePrice}>{formatPrice(parseFloat(discountedPrice))}</span>
                            {discount > 0 && (
                                <>
                                    <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                                    <span className={styles.discountBadge}>{discount}% OFF</span>
                                </>
                            )}
                        </div>

                        {/* Stock */}
                        <p className={styles.stock}>
                            {product.stock > 0
                                ? <><span className={styles.stockDot} />In Stock ({product.stock} available)</>
                                : <span className={styles.outOfStock}>Out of Stock</span>
                            }
                        </p>

                        {/* Add to Cart / Wishlist */}
                        <ProductActions product={product} discountedPrice={parseFloat(discountedPrice)} />

                        {/* Accordions */}
                        <ProductAccordion sections={accordionSections} />
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className={styles.related}>
                        <h2 className={styles.relatedTitle}>You May Also Like</h2>
                        <ProductGrid products={relatedProducts} />
                    </section>
                )}
            </div>
        </div>
    );
}
