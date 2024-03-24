const { body, param } = require('express-validator');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

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
  body('TxHash')
    .optional()
    .isLength({ min: 1 })
    .withMessage('TxHash must be a non-empty string if provided'),
  body('To')
    .isInt()
    .withMessage('To must be an integer representing the UserID'),
  body('From')
    .isInt()
    .withMessage('From must be an integer representing the UserID'),
  body('SolAmount')
    .optional()
    .isNumeric()
    .withMessage('SolAmount must be a number and can be positive or negative'),
  body('Amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number and can be positive or negative'),
  body('Description')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Description should be provided if present'),
  logValidationErrors,
];

const validateTransactionUpdate = [
  body('TxHash')
    .optional()
    .isLength({ min: 1 })
    .withMessage('TxHash must be a non-empty string if provided'),
  body('SolAmount')
    .optional()
    .isNumeric()
    .withMessage('SolAmount must be a number and can be positive or negative'),
  body('Amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number and can be positive or negative'),
  body('Description')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Description should be provided if present'),
  param('TxID').isInt().withMessage('TxID must be a valid integer'),
  logValidationErrors,
];

module.exports = {
  validateTransactionCreation,
  validateTransactionUpdate,
};
