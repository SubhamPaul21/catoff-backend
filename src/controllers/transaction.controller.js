const {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
} = require('../services/transaction.service');
const { makeResponse } = require('../utils/responseMaker');
const logger = require('../utils/logger');

const createTransactionHandler = async (req, res) => {
  logger.debug(
    '[TransactionController] Attempt to create a transaction started'
  );
  try {
    const transaction = await createTransaction(req.body);
    logger.info('[TransactionController] Transaction created successfully');
    makeResponse(
      res,
      201,
      true,
      'Transaction created successfully',
      transaction
    );
  } catch (error) {
    logger.error(
      `[TransactionController] Error creating transaction: ${error.message}`
    );
    makeResponse(res, 500, false, 'Error creating transaction', error.message);
  }
};

const getTransactionHandler = async (req, res) => {
  const txID = req.params.TxID;
  logger.debug(
    `[TransactionController] Attempt to retrieve transaction with ID: ${txID} started`
  );
  try {
    const transaction = await getTransaction(txID);
    if (!transaction) {
      logger.info(`[TransactionController] Transaction not found: ${txID}`);
      return makeResponse(res, 404, false, 'Transaction not found');
    }
    logger.info('[TransactionController] Transaction retrieved successfully');
    makeResponse(
      res,
      200,
      true,
      'Transaction retrieved successfully',
      transaction
    );
  } catch (error) {
    logger.error(
      `[TransactionController] Error retrieving transaction: ${error.message}`
    );
    makeResponse(
      res,
      500,
      false,
      'Error retrieving transaction',
      error.message
    );
  }
};

const getAllTransactionsHandler = async (req, res) => {
  logger.debug(
    '[TransactionController] Attempt to retrieve all transactions started'
  );
  try {
    const transactions = await getAllTransactions();
    logger.info(
      '[TransactionController] All transactions retrieved successfully'
    );
    makeResponse(
      res,
      200,
      true,
      'Transactions retrieved successfully',
      transactions
    );
  } catch (error) {
    logger.error(
      `[TransactionController] Error retrieving transactions: ${error.message}`
    );
    makeResponse(
      res,
      500,
      false,
      'Error retrieving transactions',
      error.message
    );
  }
};

const updateTransactionHandler = async (req, res) => {
  const txID = req.params.TxID;
  logger.debug(
    `[TransactionController] Attempt to update transaction with ID: ${txID} started`
  );
  try {
    const updated = await updateTransaction(txID, req.body);
    if (!updated) {
      logger.info(
        `[TransactionController] Transaction not found for update: ${txID}`
      );
      return makeResponse(res, 404, false, 'Transaction not found');
    }
    logger.info('[TransactionController] Transaction updated successfully');
    makeResponse(res, 200, true, 'Transaction updated successfully');
  } catch (error) {
    logger.error(
      `[TransactionController] Error updating transaction: ${error.message}`
    );
    makeResponse(res, 500, false, 'Error updating transaction', error.message);
  }
};

const deleteTransactionHandler = async (req, res) => {
  const txID = req.params.TxID;
  logger.debug(
    `[TransactionController] Attempt to delete transaction with ID: ${txID} started`
  );
  try {
    const deleted = await deleteTransaction(txID);
    if (!deleted) {
      logger.info(
        `[TransactionController] Transaction not found for deletion: ${txID}`
      );
      return makeResponse(res, 404, false, 'Transaction not found');
    }
    logger.info('[TransactionController] Transaction deleted successfully');
    makeResponse(res, 200, true, 'Transaction deleted successfully');
  } catch (error) {
    logger.error(
      `[TransactionController] Error deleting transaction: ${error.message}`
    );
    makeResponse(res, 500, false, 'Error deleting transaction', error.message);
  }
};

module.exports = {
  createTransactionHandler,
  getTransactionHandler,
  getAllTransactionsHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
};
