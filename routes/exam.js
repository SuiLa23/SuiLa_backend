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
  const results = await Question.findAll({
      where: {
          id: {
              [Op.in]: combinations.map(combination => Sequelize.literal(`id % 10 = ${combination}`))
          }
      },
      order: Sequelize.literal('RAND()')
  });
  return results;
}

async function fetchRowsNotInCombination(combination) {
  const excludedModValues = combination.map(num => num % 10);
  const rows = await Question.findAll({
      where: {
          id: {
              [Sequelize.Op.notIn]: excludedModValues
          }
      },
      order: Sequelize.literal('RAND()'),
      raw: true
  });
  return rows;
}

router.get('/get_cost', async (req, res) => {
  const { user_address, difficulty, confidence } = req.body;
  const test_pool = fetchRowsInCombination(
    mapIndexToCombination(
      convertToIndex(user_address)
    )
  )
  try {
    if (test_pool.rowCount > 0) {
      res.json({ message: 'good.' });
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
});

module.exports = router;
