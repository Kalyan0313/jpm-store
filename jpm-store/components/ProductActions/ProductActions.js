'use client';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart } from 'react-icons/hi';
import { useToast } from '@/components/Toast/ToastContainer';
import styles from './ProductActions.module.css';

export default function ProductActions({ product, discountedPrice }) {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((s) => s.wishlist.items);
    const isWishlisted = wishlistItems.some((i) => i.id === product.id);
    const { addToast } = useToast();

    const cartItem = {
        id: product.id,
        title: product.title,
        price: discountedPrice,
        thumbnail: product.thumbnail,
        brand: product.brand,
        category: product.category,
    };

    const wishlistItem = {
        ...cartItem,
        originalPrice: product.price,
        discountPercentage: product.discountPercentage,
        rating: product.rating,
    };

    const handleCart = () => {
        dispatch(addToCart(cartItem));
        addToast({ message: `${product.title.slice(0, 28)}… added to cart`, type: 'success' });
    };

    const handleWishlist = () => {
        if (isWishlisted) {
            dispatch(removeFromWishlist(product.id));
            addToast({ message: 'Removed from wishlist', type: 'info' });
        } else {
            dispatch(addToWishlist(wishlistItem));
            addToast({ message: 'Added to wishlist ❤️', type: 'success' });
        }
    };

    return (
        <div className={styles.actions}>
            <button className={styles.addToCart} onClick={handleCart} disabled={product.stock === 0}>
                <HiOutlineShoppingCart />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
                className={`${styles.wishlist} ${isWishlisted ? styles.wishlisted : ''}`}
                onClick={handleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                {isWishlisted ? <HiHeart /> : <HiOutlineHeart />}
            </button>
        </div>
    );
}
