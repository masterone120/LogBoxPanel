// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Box,
    Snackbar,
    Alert
} from '@mui/material';

// Import the image
import loginImage from '../assets/images/login.png'; // Adjust the path as necessary
import './Login.css'; // Import your CSS file

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://192.168.11.131:5000/login', {
                username,
                password,
            });

            if (response.data.token) {
                dispatch(login({ token: response.data.token }));
                navigate('/', { replace: true });
            } else {
                console.error('Token not found in response');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Login failed');
            } else if (error.request) {
                setErrorMessage('Network error. Please try again later.');
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: 2
            }}
        >
            {/* Replace Typography with an Image */}
            <img src={loginImage} alt="Login" style={{ width: '100%', maxWidth: 400, marginBottom: 20, animation: 'bounce 2s infinite' }} />
            
            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400 }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                <Button className="shining-button" variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            {errorMessage && (
                <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
                    <Alert onClose={() => setErrorMessage('')} severity="error">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default Login;
