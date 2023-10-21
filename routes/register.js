const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Sequelize } = require('sequelize');


// Handle POST requests to /login
router.post('/', async (req, res) => {
  const { user_address } = req.body;

  try {
    const query = await User.findOne({ where: { user_address: { [Sequelize.Op.eq]: user_address },  }})
    if (query) {
      return res.send({ message: 'Already registered' })
    }
    
    // Perform user authentication query here
    const result = await User.create({
      user_address: user_address,
      level: 500,
    })

    if (result) {
      res.json({ message: 'Register successful' });
    } else {
      res.status(401).json({ message: 'Register failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
