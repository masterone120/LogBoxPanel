import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      };
      const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
    };

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(isAuthenticated === 'true');
      }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }} >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};