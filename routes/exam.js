const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');

function convertToIndex(str) {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    const hex = hash.digest('hex');
    const intValue = BigInt('0x' + hex);
    return Number(intValue % 120n);  // 0 ~ 119
}

function generateCombinations() {
    const combinations = [];
    for (let i = 1; i <= 10; i++) {
        for (let j = i + 1; j <= 10; j++) {
            for (let k = j + 1; k <= 10; k++) {
                combinations.push([i, j, k]);
            }
        }
    }
    return combinations;
}

function mapIndexToCombination(index) {
    const combinations = generateCombinations();
    return combinations[index];
}

async function fetchRowsInCombination(combinations) {
  const whereConditions = combinations.map(combination => Sequelize.literal(`id % 10 = ${combination}`));
  const results = await Question.findAll({
    where: Sequelize.or(...whereConditions),
    order: Sequelize.literal('RANDOM()')
  });

  return results;
}

async function fetchRowsNotInCombination(combinations) {
  const whereConditions = combinations.map(combination => Sequelize.literal(`id % 10 != ${combination}`));
  const results = await Question.findAll({
    where: Sequelize.or(...whereConditions),
    order: Sequelize.literal('RANDOM()')
  });

  return results;
}

router.get('/get_cost', async (req, res) => {
  const { user_address, difficulty, confidence } = req.body;
  const question_idxs = mapIndexToCombination(
    convertToIndex(user_address)
  )
  const test_pool = await fetchRowsInCombination(
   question_idxs 
  )
  try {
    if (test_pool.length > 0) {
      res.json({ cost: 50 });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/take_exam', async (req, res) => {
  const {user_address, difficulty, confidence} = req.body;
  const question_idxs = mapIndexToCombination(
    convertToIndex(user_address)
  )
  const test_pool = await fetchRowsInCombination(
   question_idxs 
  )
  res.json(test_pool)
});

module.exports = router;
