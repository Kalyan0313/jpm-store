'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineSearch, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineLogout } from 'react-icons/hi';
import { HiOutlineUser } from 'react-icons/hi2';
import { logout } from '@/store/authSlice';
import { useToast } from '@/components/Toast/ToastContainer';
import JPMLogo from '@/components/Logo/JPMLogo';
import styles from './Navbar.module.css';

const NAV_LINKS = [
    { label: 'Smartwatches', href: '/category/smartwatches' },
    { label: 'Earphones', href: '/category/earphones' },
    { label: 'Laptops', href: '/category/laptops' },
    { label: 'Mobiles', href: '/category/mobiles' },
];

export default function Navbar({ onCartOpen, onSearchOpen }) {
    const dispatch = useDispatch();
    const { addToast: showToast } = useToast();
    const cartQuantity = useSelector((state) => state.cart.totalQuantity);
    const wishlistCount = useSelector((state) => state.wishlist.items.length);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Shadow on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close user menu on outside click
    useEffect(() => {
        function handleClick(e) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function handleLogout() {
        dispatch(logout());
        setUserMenuOpen(false);
        showToast({ message: 'Logged out successfully', type: 'info' });
    }

    // Avatar initials from user name
    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
        : '';

    return (
        <>
            <header
                className={styles.navbar}
                style={{ boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none' }}
            >
                <div className={styles.inner}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)} aria-label="JPM Store — Home">
                        <JPMLogo size="md" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={styles.nav} aria-label="Main navigation">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className={styles.navLink}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className={styles.actions}>
                        {/* Search */}
                        <button className={styles.iconBtn} onClick={onSearchOpen} aria-label="Search" title="Search">
                            <HiOutlineSearch />
                        </button>

                        {/* Wishlist */}
                        <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
                            <HiOutlineHeart />
                            {wishlistCount > 0 && (
                                <span className={styles.iconBadge}>{wishlistCount}</span>
                            )}
                        </Link>

                        {/* Cart */}
                        <button className={styles.iconBtn} onClick={onCartOpen} aria-label={`Cart (${cartQuantity} items)`} title="Cart">
                            <HiOutlineShoppingBag />
                            {cartQuantity > 0 && (
                                <span className={styles.iconBadge}>{cartQuantity > 99 ? '99+' : cartQuantity}</span>
                            )}
                        </button>

                        {/* User — avatar dropdown if logged in, login icon if guest */}
                        {isAuthenticated ? (
                            <div className={styles.userMenu} ref={userMenuRef}>
                                <button
                                    className={styles.avatarBtn}
                                    onClick={() => setUserMenuOpen((v) => !v)}
                                    aria-label="User menu"
                                    aria-expanded={userMenuOpen}
                                >
                                    <span className={styles.avatar}>{initials}</span>
                                </button>

                                {userMenuOpen && (
                                    <div className={styles.dropdown}>
                                        <div className={styles.dropdownUser}>
                                            <span className={styles.dropdownName}>{user.name}</span>
                                            <span className={styles.dropdownEmail}>{user.email}</span>
                                        </div>
                                        <div className={styles.dropdownDivider} />
                                        <Link href="/checkout" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                                            <HiOutlineShoppingBag /> Checkout
                                        </Link>
                                        <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                                            <HiOutlineLogout /> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className={styles.iconBtn} aria-label="Sign in" title="Sign in">
                                <HiOutlineUser />
                            </Link>
                        )}

                        {/* Hamburger */}
                        <button
                            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle mobile menu"
                            aria-expanded={mobileOpen}
                        >
                            <span className={styles.hamburgerLine} />
                            <span className={styles.hamburgerLine} />
                            <span className={styles.hamburgerLine} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <nav
                className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}
                aria-label="Mobile navigation"
                aria-hidden={!mobileOpen}
            >
                {NAV_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                        {link.label}
                    </Link>
                ))}
                <Link href="/wishlist" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                {isAuthenticated ? (
                    <button className={styles.mobileNavLink} onClick={() => { handleLogout(); setMobileOpen(false); }}>
                        Sign out ({user?.name})
                    </button>
                ) : (
                    <Link href="/login" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                        Sign in
                    </Link>
                )}
            </nav>
        </>
    );
}
