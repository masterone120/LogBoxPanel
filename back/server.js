const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors());
app.use(bodyParser.json());


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    port: 5432,
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});


app.post('/register', async (req, res) => {
    const { username, password }= req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query('INSERT INTO users (username, password_digest) VALUES ($1, $2) RETURNING id', [username, hashedPassword]);
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
            const token = jwt.sign({ id:user.id}, '@lis.159654', { expiresIn: '1h'});
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid Credentials'});
        }
    } catch (error) {
        res.status(500).json({ error: 'Login Failed'});
    }
});
