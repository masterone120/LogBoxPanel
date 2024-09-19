const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://192.168.11.131:5173' // Adjust this to match your React app's URL
}));


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

let tokenBlacklist = [];

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

app.post('/api', async (req, res) => {
    const { browser, event, host, pid, session, terminal, time, title, url, user } = req.body;

    // Check if the event is "open"
    if (event !== "Opened") {
        return res.status(400).json({ error: 'Event must be "Opened" to insert' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO api ("browser", "event", "host", "pid", "session", "terminal", "time", "title", "url", "user") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
            [browser, event, host, pid, session, terminal, time, title, url, user]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Data Insert Failed' });
    }
});


app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM api'); // Adjust table name as necessary
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password_digest) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (user && await bcrypt.compare(password, user.password_digest)) {
            const token = jwt.sign({ id: user.id }, '@lis.159654', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/logout', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header
    if (token) {
        tokenBlacklist.push(token); // Add token to blacklist
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    res.status(400).json({ error: 'No token provided' });
});

const isTokenBlacklisted = (token) => {
    return tokenBlacklist.includes(token);
};

app.get('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token || isTokenBlacklisted(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, '@lis.159654', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        // Proceed with protected resource
        res.json({ message: 'This is protected data', userId: decoded.id });
    });
});