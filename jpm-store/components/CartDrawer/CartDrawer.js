'use client';

import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { removeFromCart, updateQuantity, clearCart } from '@/store/cartSlice';
import { HiX, HiOutlineShoppingBag, HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const { items, totalAmount, totalQuantity } = useSelector((s) => s.cart);
    const { isAuthenticated } = useSelector((s) => s.auth);
    const checkoutHref = isAuthenticated ? '/checkout' : '/login?redirect=/checkout';

    const handleQtyChange = (id, qty) => dispatch(updateQuantity({ id, quantity: qty }));
    const handleRemove = (id) => dispatch(removeFromCart(id));
    const handleClear = () => dispatch(clearCart());

    // Format as INR
    const formatPrice = (p) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p * 84);

    return (
        <>
            {/* Drawer */}
            <aside
                className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
                aria-label="Shopping cart"
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <HiOutlineShoppingBag className={styles.headerIcon} />
                        <h2 className={styles.headerTitle}>
                            Your Cart
                            {totalQuantity > 0 && <span className={styles.headerBadge}>{totalQuantity}</span>}
                        </h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
                        <HiX />
                    </button>
                </div>

                {/* Body */}
                {items.length === 0 ? (
                    <div className={styles.empty}>
                        <HiOutlineShoppingBag className={styles.emptyIcon} />
                        <p className={styles.emptyTitle}>Your cart is empty</p>
                        <p className={styles.emptyDesc}>Add some products to get started!</p>
                        <Link href="/category/mobiles" className={`btn btn-primary ${styles.emptyBtn}`} onClick={onClose}>
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.items}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemImage}>
                                        <Image src={item.thumbnail} alt={item.title} width={72} height={72} className={styles.img} />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <p className={styles.itemTitle}>{item.title}</p>
                                        <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                                        <div className={styles.qtyRow}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                                aria-label="Decrease quantity"
                                            >
                                                <HiMinus />
                                            </button>
                                            <span className={styles.qty}>{item.quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                                aria-label="Increase quantity"
                                            >
                                                <HiPlus />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => handleRemove(item.id)}
                                        aria-label={`Remove ${item.title}`}
                                    >
                                        <HiTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className={styles.footer}>
                            <div className={styles.subtotalRow}>
                                <span className={styles.subtotalLabel}>Subtotal</span>
                                <span className={styles.subtotalVal}>{formatPrice(totalAmount)}</span>
                            </div>
                            <p className={styles.taxNote}>Taxes and shipping calculated at checkout</p>
                            <Link
                                href={checkoutHref}
                                className={`btn btn-primary ${styles.checkoutBtn}`}
                                onClick={onClose}
                            >
                                Proceed to Checkout
                            </Link>
                            <button className={styles.clearBtn} onClick={handleClear}>
                                Clear Cart
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
