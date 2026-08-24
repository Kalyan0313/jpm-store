'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { formatPrice, getDiscountedPrice } from '@/utils/api';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiStar } from 'react-icons/hi';
import { useToast } from '@/components/Toast/ToastContainer';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((s) => s.wishlist.items);
    const isWishlisted = wishlistItems.some((i) => i.id === product.id);
    const { addToast } = useToast();

    const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
    const originalPrice = formatPrice(product.price);
    const salePrice = formatPrice(parseFloat(discountedPrice));
    const discount = Math.round(product.discountPercentage);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: parseFloat(discountedPrice),
            thumbnail: product.thumbnail,
            brand: product.brand,
            category: product.category,
        }));
        addToast({ message: `${product.title.slice(0, 30)}… added to cart`, type: 'success' });
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            dispatch(removeFromWishlist(product.id));
            addToast({ message: 'Removed from wishlist', type: 'info' });
        } else {
            dispatch(addToWishlist({
                id: product.id,
                title: product.title,
                price: parseFloat(discountedPrice),
                originalPrice: product.price,
                discountPercentage: product.discountPercentage,
                thumbnail: product.thumbnail,
                brand: product.brand,
                category: product.category,
                rating: product.rating,
            }));
            addToast({ message: 'Added to wishlist ❤️', type: 'success' });
        }
    };

    return (
        <Link href={`/product/${product.id}`} className={styles.card}>
            {/* Image area */}
            <div className={styles.imageWrap}>
                {discount > 0 && (
                    <span className={styles.discountBadge}>{discount}% OFF</span>
                )}
                <button
                    className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
                    onClick={handleWishlist}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isWishlisted ? <HiHeart /> : <HiOutlineHeart />}
                </button>
                <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={300}
                    height={300}
                    className={styles.image}
                    sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Quick add overlay */}
                <div className={styles.overlay}>
                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                        <HiOutlineShoppingCart />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Info area */}
            <div className={styles.info}>
                {product.brand && (
                    <p className={styles.brand}>{product.brand}</p>
                )}
                <h3 className={styles.title}>{product.title}</h3>

                {/* Rating */}
                <div className={styles.ratingRow}>
                    <HiStar className={styles.starIcon} />
                    <span className={styles.ratingVal}>{product.rating?.toFixed(1)}</span>
                </div>

                {/* Pricing */}
                <div className={styles.pricing}>
                    <span className={styles.salePrice}>{salePrice}</span>
                    {discount > 0 && (
                        <span className={styles.originalPrice}>{originalPrice}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
