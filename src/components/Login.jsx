// src/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth} from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const [successMessage, setSuccessMessage] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        // setSuccessMessage('');

        try {
            const response = await axios.post('http://192.168.11.131:5050/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token); // Store the token
            // setSuccessMessage('Login successful!');
            // Redirect or perform other actions as needed
            auth.login();
            navigate('/');
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {/*{successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}*/}
        </div>
    );
};

export default Login;
