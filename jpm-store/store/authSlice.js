import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi } from '@/utils/api';

export const loginUserThunk = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await loginApi({ email, password });
            return data;
        } catch (err) {
            return rejectWithValue(err.message || 'Login failed');
        }
    }
);

export const registerUserThunk = createAsyncThunk(
    'auth/registerUser',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const data = await registerApi({ name, email, password });
            return data;
        } catch (err) {
            return rejectWithValue(err.message || 'Registration failed');
        }
    }
);

export const logoutUserThunk = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await logoutApi();
            return true;
        } catch (err) {
            return true; // Still clear local state on logout error
        }
    }
);

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    users: [], // mock fallback storage
};

function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return h.toString(36);
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        register(state, action) {
            const { name, email, phone, password } = action.payload;
            const existing = state.users.find(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );
            if (existing) throw new Error('Email already registered');

            const newUser = {
                id: Date.now().toString(),
                name,
                email: email.toLowerCase(),
                phone,
                passwordHash: simpleHash(password),
            };
            state.users.push(newUser);

            state.user = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone };
            state.isAuthenticated = true;
            state.error = null;
        },

        login(state, action) {
            const { email, password } = action.payload;
            const found = state.users.find(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );
            if (!found) throw new Error('No account found with this email');
            if (found.passwordHash !== simpleHash(password)) throw new Error('Incorrect password');

            state.user = { id: found.id, name: found.name, email: found.email, phone: found.phone };
            state.isAuthenticated = true;
            state.error = null;
        },

        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },

        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login Thunk
            .addCase(loginUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register Thunk
            .addCase(registerUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout Thunk
            .addCase(logoutUserThunk.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { register, login, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
