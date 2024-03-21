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
const logger = require('../utils/logger');

router.post(
  '/',
  (req, res, next) => {
    logger.info('POST /transactions - Creating a new transaction');
    next();
  },
  validateTransactionCreation,
  createTransactionHandler
);
router.get(
  '/:TxID',
  (req, res, next) => {
    logger.info(
      `GET /transactions/${req.params.TxID} - Retrieving a transaction`
    );
    next();
  },
  getTransactionHandler
);
router.get(
  '/',
  (req, res, next) => {
    logger.info('GET /transactions - Retrieving all transactions');
    next();
  },
  getAllTransactionsHandler
);
router.put(
  '/:TxID',
  (req, res, next) => {
    logger.info(
      `PUT /transactions/${req.params.TxID} - Updating a transaction`
    );
    next();
  },
  validateTransactionUpdate,
  updateTransactionHandler
);
router.delete(
  '/:TxID',
  (req, res, next) => {
    logger.info(
      `DELETE /transactions/${req.params.TxID} - Deleting a transaction`
    );
    next();
  },
  deleteTransactionHandler
);

module.exports = router;
