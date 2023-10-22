const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const constants = require('../constants');
const secret = require('../secret');



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

router.post('/submit', async (req, res) => {
  const {user_address, question_id_list, answer_list} = req.body;
  
  try {
      let score = 0;
      for (let i = 0; i < question_id_list.length; i++) {
        const question = await Question.findOne({
          where: { id: {
            [Sequelize.Op.eq]: question_id_list[i], 
          },}
      })

      if (!question) {
        return res.send({ message: 'Question does not exist' });
      }

      // Calculate the score here
    }

    const SCORE_TO_PASS = 0

    if (score >= SCORE_TO_PASS) {
      // Mint the badge to the user
      // create a client connected to devnet
      const client = new SuiClient({ url: getFullnodeUrl('devnet') });

      // Generate a new Ed25519 Keypair
      const keypair = Ed25519Keypair.deriveKeypair(`${secret.MNEMONICS}`);
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${constants.PACKAGE}::badge::mint_badge`,
        arguments: [
          tx.pure(`${constants.CERTIFIED_ISSUER_CAP}`), 
          tx.pure(`0x6`), 
          tx.pure(`${user_address}`),
          tx.pure(31536000000), // ms 
          tx.pure(100), // difficulty-level
          tx.pure(50), // confience-level
        ],
        gasBudget: constants.GAS_BUDGET,
      });
      const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
      });

      if (result) {
        res.send({ message: 'Congrats! You passed the exam and got a badge! Check your wallet :)' })
      } 
    } else {
      res.send({ message: 'You failed to pass the exam. Try harder.'})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Oh no... Something went wrong. Contact our customer service for help.' });
  }
});

module.exports = router;
