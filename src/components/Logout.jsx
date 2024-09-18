// src/components/LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice'; // Import logout action
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default LogoutButton;
