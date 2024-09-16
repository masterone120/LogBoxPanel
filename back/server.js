const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
// app.use(cors());
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://192.168.11.131:5173' // Adjust this to match your React app's URL
}));


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

app.post('/api', async (req, res) => {
    const { browser, event, host, pid, session, terminal, time, title, url, user } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO api (browser, event, host, pid, session, terminal, time, title, url, user) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),[browser, event, host, pid, session, terminal, time, title, url, user]'
        );
        res.status(201).json({ id: result.rows[0].id});
    } catch (error) {
        res.status(500).json({ error: 'Data Insert Failed'});
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
