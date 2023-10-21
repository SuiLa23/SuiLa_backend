const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'test',
  password: 'test',
  database: 'SuiLa_db',
});

const User = sequelize.define('User', {
  user_address: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  level: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Create the table if it doesn't exist
sequelize.sync();

module.exports = User;
