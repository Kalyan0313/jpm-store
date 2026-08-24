import HeroBanner from '@/components/HeroBanner/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import FeaturesRow from '@/components/FeaturesRow/FeaturesRow';
import PromoBanner from '@/components/PromoBanner/PromoBanner';
import BestSellers from '@/components/BestSellers/BestSellers';
import NewArrivals from '@/components/NewArrivals/NewArrivals';
import RevealSection from '@/components/RevealSection/RevealSection';
import { fetchProductsByCategory } from '@/utils/api';

export const metadata = {
    title: 'JPM Store — Premium Electronics',
    description:
        'Shop premium smartwatches, earphones, laptops, and mobiles at JPM Store. Best prices with free shipping above ₹999.',
};

// Map internal category keys directly to MongoDB category slugs
const CATEGORY_MAP = {
    smartwatches: 'smartwatches',
    earphones: 'earphones',
    laptops: 'laptops',
    mobiles: 'mobiles',
};

async function getAllCategoryProducts() {
    const entries = await Promise.all(
        Object.entries(CATEGORY_MAP).map(async ([key, slug]) => {
            try {
                const data = await fetchProductsByCategory(slug, { limit: 10 });
                return [key, data.products];
            } catch (err) {
                console.error(`Error fetching category ${slug}:`, err.message);
                return [key, []];
            }
        })
    );
    return Object.fromEntries(entries);
}

export default async function HomePage() {
    // Fetch all categories in parallel on the server
    const allProducts = await getAllCategoryProducts();

    // Latest arrivals: take first 10 smartphones
    const newArrivalsData = allProducts.mobiles?.slice(0, 10) || [];

    return (
        <>
            {/* Hero — above fold */}
            <HeroBanner />

            {/* Features strip */}
            <RevealSection tag="section">
                <FeaturesRow />
            </RevealSection>

            {/* Category Grid */}
            <RevealSection>
                <CategoryGrid />
            </RevealSection>

            {/* Best Sellers */}
            <RevealSection>
                <BestSellers allProducts={allProducts} />
            </RevealSection>

            {/* Promo Banners */}
            <RevealSection direction="scale">
                <PromoBanner />
            </RevealSection>

            {/* New Arrivals */}
            <RevealSection>
                <NewArrivals products={newArrivalsData} />
            </RevealSection>
        </>
    );
}
