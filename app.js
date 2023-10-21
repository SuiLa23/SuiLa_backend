const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');

// Initialize a PostgreSQL connection pool
const pool = new Pool({
  user: 'test',
  host: 'localhost',
  database: 'SuiLa_db',
  password: 'test',
  port: 5432,
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Handle POST requests to /login
app.get('/', async (req, res) => {
  // create a client connected to devnet
  const client = new SuiClient({ url: getFullnodeUrl('devnet') });

  // get coins owned by an address
  const coins = await client.getCoins({
    owner: '0x4c213ea8e5093f567cb71f7594b95033c2ee671bc36b04c89486b5451fb6f8aa',
  });
  res.status(200).json({ message: 'Hello user', coins });
});

// Load routes
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

const questionRoute = require('./routes/question');
app.use('/question', questionRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
