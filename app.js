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

app.get('/get_validation_question', async(req, res) => {
  const userAddress = req.query.user_address;
  const badgeId = req.query.badge_id;

  if (!badgeId || !uuidv4.validate(badgeId)) {
      return res.status(406).send('Not Acceptable');
  }

  const question = getValidQuestion(userAddress); 
  res.status(200).json(question);
});

// Load routes

const examRoute = require('./routes/exam');
app.use('/exam', examRoute);

const loginRoute = require('./routes/register');
app.use('/register', loginRoute);

const questionRoute = require('./routes/question');
app.use('/question', questionRoute);

const examRoute = require('./routes/exam');
app.use('/exam', examRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
