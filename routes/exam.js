const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const constants = require('../constants');
const secret = require('../constants');



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

function keyFunction1_mocked(questions, user_answers) {
  // Mocked key function
  const length = questions.length; 
  let accumulatedValue = 0;

  for (let i = 0; i < length; i++) {
      const correct = (questions[i]['answer_index'] == user_answers[i]);
      const difficulty = questions[i]['difficulty'];
      const sensitivity = questions[i]['sensitivity']+1;
      accumulatedValue += correct * difficulty * sensitivity; 
  }
  return accumulatedValue / length;
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

function getRandomItemsFromArray(array, n) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

router.get('/take_exam', async (req, res) => {
  const {user_address, difficulty, confidence} = req.body;
  const diff_mapping = new Map();
  diff_mapping.set('A1', 150);
  diff_mapping.set('A2', 300);
  diff_mapping.set('B1', 450);
  diff_mapping.set('B2', 550);
  diff_mapping.set('C1', 700);
  diff_mapping.set('C2', 850);
  const question_idxs = mapIndexToCombination(
    convertToIndex(user_address)
  )
  const test_pool = await fetchRowsInCombination(
   question_idxs 
  )
  const filteredItems = test_pool.filter(
    item => item.difficulty >= diff_mapping.get(difficulty)-150 && item.difficulty <= diff_mapping.get(difficulty)+150);
  const selectedItems = getRandomItemsFromArray(filteredItems, confidence*2);
  
  res.json(selectedItems)
});

router.post('/submit', async (req, res) => {
  const {user_address, question_id_list, answer_list} = req.body;
    let promises = question_id_list.map(id => {
      return Question.findOne({
          where: { id: { [Sequelize.Op.eq]: id } }
        });
      });
    let questions = await Promise.all(promises);
    if (questions.length != answer_list.length) {
      return res.send({ message: 'Some questions do not exist' });
    }
    const score= keyFunction1_mocked(questions,answer_list);
  

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
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'Oh no... Something went wrong. Contact our customer service for help.' });
});

module.exports = router;
