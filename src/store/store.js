// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the auth slice

const store = configureStore({
    reducer: {
        auth: authReducer, // Add the auth reducer to the store
    },
});

export default store;