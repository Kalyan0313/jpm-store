'use client';

import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { removeFromWishlist } from '@/store/wishlistSlice';
import { addToCart } from '@/store/cartSlice';
import { formatPrice } from '@/utils/api';
import { HiOutlineHeart, HiOutlineShoppingCart, HiX } from 'react-icons/hi';
import styles from './page.module.css';

export default function WishlistPage() {
    const dispatch = useDispatch();
    const items = useSelector((s) => s.wishlist.items);

    const handleAddToCart = (item) => {
        dispatch(addToCart({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail,
            brand: item.brand,
            category: item.category,
        }));
        dispatch(removeFromWishlist(item.id));
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        <HiOutlineHeart className={styles.titleIcon} />
                        Wishlist
                    </h1>
                    {items.length > 0 && (
                        <p className={styles.count}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className={styles.empty}>
                        <HiOutlineHeart className={styles.emptyIcon} />
                        <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
                        <p className={styles.emptyDesc}>Save items you love and come back to them anytime.</p>
                        <Link href="/" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => dispatch(removeFromWishlist(item.id))}
                                    aria-label={`Remove ${item.title} from wishlist`}
                                >
                                    <HiX />
                                </button>

                                <Link href={`/product/${item.id}`} className={styles.imageWrap}>
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.title}
                                        width={240}
                                        height={240}
                                        className={styles.image}
                                    />
                                </Link>

                                <div className={styles.info}>
                                    {item.brand && <p className={styles.brand}>{item.brand}</p>}
                                    <Link href={`/product/${item.id}`} className={styles.name}>{item.title}</Link>
                                    <div className={styles.priceRow}>
                                        <span className={styles.price}>{formatPrice(item.price)}</span>
                                        {item.originalPrice && item.price < item.originalPrice && (
                                            <span className={styles.originalPrice}>{formatPrice(item.originalPrice)}</span>
                                        )}
                                    </div>

                                    <button
                                        className={styles.addToCartBtn}
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <HiOutlineShoppingCart />
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
