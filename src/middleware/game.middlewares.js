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

const validateGameCreation = [
  body('GameType').isInt().withMessage('GameType must be an integer'),
  body('GameDescription')
    .isLength({ min: 1 })
    .withMessage('GameDescription is required'),
  logValidationErrors,
];

const validateGameUpdate = [
  body('GameType')
    .optional()
    .isInt()
    .withMessage('GameType must be an integer'),
  body('GameDescription')
    .optional()
    .isLength({ min: 1 })
    .withMessage('GameDescription is required'),
  param('ID').isInt().withMessage('Game ID must be a valid integer'),
  logValidationErrors,
];

module.exports = {
  validateGameCreation,
  validateGameUpdate,
};
