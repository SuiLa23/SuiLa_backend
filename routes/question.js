const Question = require('../models/Question');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

const { Sequelize } = require('sequelize');

// Handle POST requests to /login
router.post('/create', async (req, res) => {
  const { description, options, answer_index, creator_address } = req.body;

  try {

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

router.get('/exercise', async (req, res) => {
  const { user_address } = req.body;
  
  try {
    const user = await User.findOne({
      where: { user_address: {
        [Sequelize.Op.eq]: user_address, 
      },}
    })

    if (!user) {
      return res.send({ message: 'You are not registered' });
    }

    const exercise_pool = await Question.findAll({ 
      where: {
        [Sequelize.Op.and]: [
          { difficulty: { [Sequelize.Op.gte]: -500 + Math.ceil(user.level) } }, // "gte" stands for "greater than or equal"
          { difficulty: { [Sequelize.Op.lte]: 50 + Math.ceil(user.level) } }, // "lte" stands for "less than or equal"
        ],
      }
    })

    const randomIndex = Math.floor(Math.random() * exercise_pool.length);

    if (exercise_pool) {
      res.json({ message: 'Exercise fetched', exercise: exercise_pool[randomIndex]});
    } else {
      res.status(401).json({ message: 'Exercise failed to be fetched' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
