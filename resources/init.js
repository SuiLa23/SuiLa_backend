const Question = require('../models/Question');
const fs = require('fs');

const jsonFilePath = 'resources/initial_questions.json';
const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
const jsonObj = JSON.parse(jsonData);
for (const key in jsonObj) {
  if (jsonObj.hasOwnProperty(key)) {
    Question.create({ 
        description: jsonObj[key]['question_text'],
        options: jsonObj[key]['options'],
        answer_index: jsonObj[key]['answer_index'],
        difficulty: jsonObj[key]['difficulty'] * 10,
        sensitivity: 0,
        validity: true,
        validation_history: [],
        solving_correctness_list: [],
        solving_level_list: [],
        creator_address: 'ghost',
      })
  }
};