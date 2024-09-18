import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import './index.css';
import { AuthProvider} from "./components/AuthContext";

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <AppRouter />
    </AuthProvider>
);