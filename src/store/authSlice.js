// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state for authentication
const initialState = {
    token: localStorage.getItem('token') || null, // Initialize from localStorage
    isAuthenticated: !!localStorage.getItem('token'), // Check if token exists
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.token = action.payload.token; // Set the token
            state.isAuthenticated = true; // Set authenticated status to true
            localStorage.setItem('token', action.payload.token); // Store token in localStorage
        },
        logout(state) {
            state.token = null; // Clear the token
            state.isAuthenticated = false; // Set authenticated status to false
            localStorage.removeItem('token'); // Remove token from localStorage
        },
    },
});

// Export actions for use in components
export const { login, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
