import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    if (typeof window === 'undefined') return { items: [], totalQuantity: 0, totalAmount: 0 };
    try {
        const serialized = localStorage.getItem('jpm_cart');
        return serialized ? JSON.parse(serialized) : { items: [], totalQuantity: 0, totalAmount: 0 };
    } catch {
        return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
};

const recalculate = (items) => {
    return {
        totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
        totalAmount: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromStorage(),
    reducers: {
        addToCart(state, action) {
            const product = action.payload;
            const existing = state.items.find((i) => i.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
            const totals = recalculate(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
        },
        removeFromCart(state, action) {
            state.items = state.items.filter((i) => i.id !== action.payload);
            const totals = recalculate(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i.id === id);
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter((i) => i.id !== id);
                } else {
                    item.quantity = quantity;
                }
            }
            const totals = recalculate(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
