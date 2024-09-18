import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import AppRouter from './Router';
import './index.css';
// import { AuthProvider} from "./components/AuthContext";
import store from './store/store'; // Import the store

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AppRouter />
    </Provider>
);