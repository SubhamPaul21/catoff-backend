const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');

const Transaction = sequelize.define(
  'Transaction',
  {
    TxID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    UserID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    Amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Transactions',
    timestamps: false,
  }
);

Transaction.sync().then(() => console.log('Transaction Model synced'));
module.exports = Transaction;
