'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import SearchModal from '@/components/SearchModal/SearchModal';

export default function ClientShell({ children }) {
    const [cartOpen, setCartOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <AnnouncementBar />
            <Navbar
                onCartOpen={() => setCartOpen(true)}
                onSearchOpen={() => setSearchOpen(true)}
            />

            <main className="page-content">
                {children}
            </main>

            <Footer />

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Overlay */}
            <div
                className={`overlay ${cartOpen || searchOpen ? 'visible' : ''}`}
                onClick={() => { setCartOpen(false); setSearchOpen(false); }}
                aria-hidden="true"
            />
        </>
    );
}
