const Transaction = require('../models/transaction.model');

const createTransaction = async (transactionData) => {
  try {
    return await Transaction.create(transactionData);
  } catch (error) {
    throw error;
  }
};

const getTransaction = async (TxID) => {
  try {
    return await Transaction.findByPk(TxID);
  } catch (error) {
    throw error;
  }
};

const getAllTransactions = async () => {
  try {
    return await Transaction.findAll();
  } catch (error) {
    throw error;
  }
};

const updateTransaction = async (TxID, transactionData) => {
  try {
    return await Transaction.update(transactionData, { where: { TxID } });
  } catch (error) {
    throw error;
  }
};

const deleteTransaction = async (TxID) => {
  try {
    return await Transaction.destroy({ where: { TxID } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTransaction,
  getTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
};
