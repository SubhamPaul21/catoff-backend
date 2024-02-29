const {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
} = require('../services/transaction.service');
const { makeResponse } = require('../utils/responseMaker');

const createTransactionHandler = async (req, res) => {
  try {
    const transaction = await createTransaction(req.body);
    return makeResponse(
      res,
      201,
      true,
      'Transaction created successfully',
      transaction
    );
  } catch (error) {
    return makeResponse(
      res,
      500,
      false,
      'Error creating transaction',
      error.message
    );
  }
};

const getTransactionHandler = async (req, res) => {
  try {
    const transaction = await getTransaction(req.params.TxID);
    if (!transaction) {
      return makeResponse(res, 404, false, 'Transaction not found');
    }
    return makeResponse(
      res,
      200,
      true,
      'Transaction retrieved successfully',
      transaction
    );
  } catch (error) {
    return makeResponse(
      res,
      500,
      false,
      'Error retrieving transaction',
      error.message
    );
  }
};

const getAllTransactionsHandler = async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    return makeResponse(
      res,
      200,
      true,
      'Transactions retrieved successfully',
      transactions
    );
  } catch (error) {
    return makeResponse(
      res,
      500,
      false,
      'Error retrieving transactions',
      error.message
    );
  }
};

const updateTransactionHandler = async (req, res) => {
  try {
    const updated = await updateTransaction(req.params.TxID, req.body);
    if (!updated) {
      return makeResponse(res, 404, false, 'Transaction not found');
    }
    return makeResponse(res, 200, true, 'Transaction updated successfully');
  } catch (error) {
    return makeResponse(
      res,
      500,
      false,
      'Error updating transaction',
      error.message
    );
  }
};

const deleteTransactionHandler = async (req, res) => {
  try {
    const deleted = await deleteTransaction(req.params.TxID);
    if (!deleted) {
      return makeResponse(res, 404, false, 'Transaction not found');
    }
    return makeResponse(res, 200, true, 'Transaction deleted successfully');
  } catch (error) {
    return makeResponse(
      res,
      500,
      false,
      'Error deleting transaction',
      error.message
    );
  }
};

module.exports = {
  createTransactionHandler,
  getTransactionHandler,
  getAllTransactionsHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
};
