const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');

const Transaction = sequelize.define('Transaction', {
  TxID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  TxHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  To: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
  From: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
  TokenAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  Token:{
    type: DataTypes.STRING,
    allowNull: true
  },
  CreditAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Timestamp: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
});

module.exports = Transaction;
