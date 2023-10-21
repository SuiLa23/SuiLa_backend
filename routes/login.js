const express = require('express');
const router = express.Router();

// Initialize the PostgreSQL pool
const { Pool } = require('pg');
const pool = new Pool({
  user: 'test',
  host: 'localhost',
  database: 'SuiLa_db',
  password: 'test',
  port: 5432,
});


// Handle POST requests to /login
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Perform user authentication query here
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const result = await pool.query(query, [username, password]);

    if (result.rowCount > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
