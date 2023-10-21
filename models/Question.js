const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'test',
  password: 'test',
  database: 'SuiLa_db',
});

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.ARRAY(Sequelize.STRING),
  },
  answer_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sensitivity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  validity: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  validation_history: {
    type: DataTypes.ARRAY(Sequelize.INTEGER),
  },
  solving_correctness_list: {
    type: DataTypes.ARRAY(Sequelize.BOOLEAN),
  },
  solving_level_list: {
    type: DataTypes.ARRAY(Sequelize.INTEGER),
  },
  creator_address: {
    type: DataTypes.STRING,
  },
});

// Create the table if it doesn't exist
Question.sync();

module.exports = Question;
