const Question = require("../models/Question");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

const { Sequelize } = require("sequelize");

// Handle POST requests to /login
router.post("/create", async (req, res) => {
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
    });

    if (result) {
      res.json({ message: "Question successful created" });
    } else {
      res.status(401).json({ message: "Question failed to be created" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/exercise", async (req, res) => {
  const { user_address, level } = req.body;
  const diff_mapping = new Map();
  diff_mapping.set("A1", 150);
  diff_mapping.set("A2", 300);
  diff_mapping.set("B1", 450);
  diff_mapping.set("B2", 550);
  diff_mapping.set("C1", 700);
  diff_mapping.set("C2", 850);
  const mappedLevel = diff_mapping.get(level);
  try {
    const exercise_pool = await Question.findAll({
      where: {
        [Sequelize.Op.and]: [
          { difficulty: { [Sequelize.Op.gte]: -500 + Math.ceil(mappedLevel) } }, // "gte" stands for "greater than or equal"
          { difficulty: { [Sequelize.Op.lte]: 50 + Math.ceil(mappedLevel) } }, // "lte" stands for "less than or equal"
        ],
      },
    });

    const randomIndex = Math.floor(Math.random() * exercise_pool.length);

    if (exercise_pool) {
      res.json({
        message: "Exercise fetched",
        exercise: exercise_pool[randomIndex],
      });
    } else {
      res.status(401).json({ message: "Exercise failed to be fetched" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
