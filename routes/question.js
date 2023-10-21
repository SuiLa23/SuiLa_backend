const Question = require('../models/Question');
const express = require('express');
const router = express.Router();

// Handle POST requests to /login
router.post('/create', async (req, res) => {
  const { description, options, answer_index, creator_address } = req.body;
  
  try {
    // Update the roles for a user with a specific username
    const result = await Question.create({ 
      description: description,
      options: options,
      answer_index: answer_index,
      difficulty: 0,
      sensitivity: 0,
      validity: false,
      validation_history: [],
      solving_correctness_list: [],
      solving_level_list: [],
      creator_address: creator_address,
    })

    if (result) {
      res.json({ message: 'Question successful created' });
    } else {
      res.status(401).json({ message: 'Question failed to be created' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
