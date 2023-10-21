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
  valid_history: {
    type: DataTypes.ARRAY(DataTypes.INT),
  },
  learning_history: {
    type: DataTypes.ARRAY(DataTypes.ARRAY),
  }
});

// Create the table if it doesn't exist
sequelize.sync();

module.exports = User;
