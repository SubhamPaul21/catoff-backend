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
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
  From: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
  SolAmount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Timestamp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Transaction;
