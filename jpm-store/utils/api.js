/* ─────────────────────────────────────────
   utils/api.js — JPM Store Backend REST API Layer
   Exclusively connects to Node.js/Express/MongoDB Backend
   ───────────────────────────────────────── */

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ─── Category Slugs matching MongoDB Database ─────────────────────
export const CATEGORY_API_SLUGS = {
    smartwatches: 'smartwatches',
    earphones: 'earphones',
    laptops: 'laptops',
    mobiles: 'mobiles',
};

// Helper function for API requests
async function safeFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${res.status}`);
    }
    return await res.json();
}

// ─── Fetch products by category slug ──────────────────────────────────────────
export async function fetchProductsByCategory(categorySlug, { limit = 10, skip = 0 } = {}) {
    const page = Math.floor(skip / limit) + 1;
    const data = await safeFetch(`${BACKEND_BASE}/products/category/${categorySlug}?limit=${limit}&page=${page}`, {
        next: { revalidate: 60 },
    });
    return {
        products: (data.data.products || []).map(p => ({ ...p, id: p._id || p.id })),
        total: data.total || (data.data.products ? data.data.products.length : 0),
    };
}

// ─── Fetch single product by ID ─────────────────────────────────────────────
export async function fetchProductById(id) {
    const data = await safeFetch(`${BACKEND_BASE}/products/${id}`, {
        next: { revalidate: 60 },
    });
    const product = data.data.product;
    return { ...product, id: product._id || product.id };
}

// ─── Search products ─────────────────────────────────────────────────────────
export async function searchProducts(query, { limit = 10 } = {}) {
    const data = await safeFetch(`${BACKEND_BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
        cache: 'no-store',
    });
    return {
        products: (data.data.products || []).map(p => ({ ...p, id: p._id || p.id })),
    };
}

// ─── All category list ───────────────────────────────────────────────────────
export async function fetchAllCategories() {
    const data = await safeFetch(`${BACKEND_BASE}/categories`, { next: { revalidate: 3600 } });
    return data.data.categories;
}

// ─── Authentication API Endpoints ─────────────────────────────────────────────
export async function loginApi({ email, password }) {
    return await safeFetch(`${BACKEND_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });
}

export async function registerApi({ name, email, password }) {
    return await safeFetch(`${BACKEND_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
    });
}

export async function logoutApi() {
    return await safeFetch(`${BACKEND_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}

// ─── Order API Endpoints ──────────────────────────────────────────────────────
export async function createOrderApi(orderData, token) {
    return await safeFetch(`${BACKEND_BASE}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
    });
}

// ─── Price & Utility Helpers ──────────────────────────────────────────────────
const USD_TO_INR = 84;

export function formatPrice(usdPrice) {
    if (usdPrice === undefined || usdPrice === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(usdPrice * USD_TO_INR);
}

export function getDiscountedPrice(price, discountPercentage) {
    if (!price) return '0.00';
    if (!discountPercentage) return Number(price).toFixed(2);
    return (price * (1 - discountPercentage / 100)).toFixed(2);
}

export function sortProducts(products, sortBy) {
    if (!Array.isArray(products)) return [];
    const arr = [...products];
    switch (sortBy) {
        case 'price-asc': return arr.sort((a, b) => a.price - b.price);
        case 'price-desc': return arr.sort((a, b) => b.price - a.price);
        case 'rating': return arr.sort((a, b) => b.rating - a.rating);
        case 'discount': return arr.sort((a, b) => b.discountPercentage - a.discountPercentage);
        default: return arr;
    }
}
