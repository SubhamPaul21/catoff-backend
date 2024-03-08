const Transaction = require('../models/transaction.model');
const logger = require('../utils/logger');

const createTransaction = async (transactionData) => {
  logger.debug('[TransactionService] Creating transaction');
  try {
    const transaction = await Transaction.create(transactionData);
    logger.info('[TransactionService] Transaction created successfully');
    return transaction;
  } catch (error) {
    logger.error(
      `[TransactionService] Error creating transaction: ${error.message}`
    );
    throw error;
  }
};

const getTransaction = async (TxID) => {
  logger.debug(`[TransactionService] Fetching transaction with TxID: ${TxID}`);
  try {
    const transaction = await Transaction.findByPk(TxID);
    if (!transaction) {
      logger.info(
        `[TransactionService] Transaction with TxID: ${TxID} not found`
      );
      return null;
    }
    logger.info('[TransactionService] Transaction fetched successfully');
    return transaction;
  } catch (error) {
    logger.error(
      `[TransactionService] Error fetching transaction: ${error.message}`
    );
    throw error;
  }
};

const getAllTransactions = async () => {
  logger.debug('[TransactionService] Fetching all transactions');
  try {
    const transactions = await Transaction.findAll();
    logger.info('[TransactionService] All transactions fetched successfully');
    return transactions;
  } catch (error) {
    logger.error(
      `[TransactionService] Error fetching all transactions: ${error.message}`
    );
    throw error;
  }
};

const updateTransaction = async (TxID, transactionData) => {
  logger.debug(`[TransactionService] Updating transaction with TxID: ${TxID}`);
  try {
    const updated = await Transaction.update(transactionData, {
      where: { TxID },
    });
    if (updated) {
      logger.info('[TransactionService] Transaction updated successfully');
      return updated;
    } else {
      logger.info('[TransactionService] Transaction not found for update');
      return null;
    }
  } catch (error) {
    logger.error(
      `[TransactionService] Error updating transaction: ${error.message}`
    );
    throw error;
  }
};

const deleteTransaction = async (TxID) => {
  logger.debug(`[TransactionService] Deleting transaction with TxID: ${TxID}`);
  try {
    const deleted = await Transaction.destroy({ where: { TxID } });
    if (deleted) {
      logger.info('[TransactionService] Transaction deleted successfully');
      return deleted;
    } else {
      logger.info('[TransactionService] Transaction not found for deletion');
      return null;
    }
  } catch (error) {
    logger.error(
      `[TransactionService] Error deleting transaction: ${error.message}`
    );
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
