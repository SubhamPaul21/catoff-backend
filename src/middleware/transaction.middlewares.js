const { body, param } = require('express-validator');

const validateTransactionCreation = [
  body('UserID').isInt().withMessage('UserID must be an integer'),
  body('Amount').isInt().withMessage('Amount must be an integer'),
  body('Description')
    .isLength({ min: 1 })
    .withMessage('Description is required'),
];

const validateTransactionUpdate = [
  // Include any fields you allow to be updated
  body('Amount').optional().isInt().withMessage('Amount must be an integer'),
  body('Description')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  param('TxID').isInt().withMessage('Index must be a valid integer'),
];

module.exports = {
  validateTransactionCreation,
  validateTransactionUpdate,
};
