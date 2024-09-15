import React, { useState } from 'react';
import axios from "axios";

const Login = () => {
    const [username, SetUsername] = useState('');
    const [password, SetPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            console.log('Login Successful:', response.data);
        } catch (error) {
            console.log('Login Failed:', error.response.data);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
