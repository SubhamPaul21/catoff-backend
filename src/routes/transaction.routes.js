const express = require('express');
const router = express.Router();
const {
  validateTransactionCreation,
  validateTransactionUpdate,
} = require('../middleware/transaction.middlewares');
const {
  createTransactionHandler,
  getTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
  getAllTransactionsHandler,
} = require('../controllers/transaction.controller');

router.post('/', validateTransactionCreation, createTransactionHandler);
router.get('/:TxID', getTransactionHandler);
router.get('/', getAllTransactionsHandler); // For fetching all transactions
router.put('/:TxID', validateTransactionUpdate, updateTransactionHandler);
router.delete('/:TxID', deleteTransactionHandler);

module.exports = router;
