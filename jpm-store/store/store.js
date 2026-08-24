import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import authReducer from './authSlice';

// Load persisted state from localStorage
function loadState() {
    if (typeof window === 'undefined') return undefined;
    try {
        return {
            cart: JSON.parse(localStorage.getItem('jpm_cart') || 'null') || undefined,
            wishlist: JSON.parse(localStorage.getItem('jpm_wishlist') || 'null') || undefined,
            auth: JSON.parse(localStorage.getItem('jpm_auth') || 'null') || undefined,
        };
    } catch {
        return undefined;
    }
}

// LocalStorage middleware — syncs cart, wishlist & auth on every action
const localStorageMiddleware = (storeAPI) => (next) => (action) => {
    const result = next(action);
    const state = storeAPI.getState();

    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('jpm_cart', JSON.stringify(state.cart));
            localStorage.setItem('jpm_wishlist', JSON.stringify(state.wishlist));
            localStorage.setItem('jpm_auth', JSON.stringify(state.auth));
        } catch {
            // Storage quota exceeded — silently fail
        }
    }

    return result;
};

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        auth: authReducer,
    },
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(localStorageMiddleware),
});
