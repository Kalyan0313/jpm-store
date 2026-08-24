import { createSlice } from '@reduxjs/toolkit';

const loadWishlistFromStorage = () => {
    if (typeof window === 'undefined') return { items: [] };
    try {
        const serialized = localStorage.getItem('jpm_wishlist');
        return serialized ? JSON.parse(serialized) : { items: [] };
    } catch {
        return { items: [] };
    }
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: loadWishlistFromStorage(),
    reducers: {
        addToWishlist(state, action) {
            const exists = state.items.find((i) => i.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist(state, action) {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },
        clearWishlist(state) {
            state.items = [];
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
