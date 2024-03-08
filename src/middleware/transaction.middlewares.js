const { body, param } = require('express-validator');
const logger = require('../utils/logger');

// Function to log and return validation errors
const logValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`Validation errors: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateTransactionCreation = [
  body('UserID').isInt().withMessage('UserID must be an integer'),
  body('Amount').isInt().withMessage('Amount must be an integer'),
  body('Description')
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  logValidationErrors,
];

const validateTransactionUpdate = [
  // Include any fields you allow to be updated
  body('Amount').optional().isInt().withMessage('Amount must be an integer'),
  body('Description')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  param('TxID').isInt().withMessage('Index must be a valid integer'),
  logValidationErrors,
];

module.exports = {
  validateTransactionCreation,
  validateTransactionUpdate,
};
