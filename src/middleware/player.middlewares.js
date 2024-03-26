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

const validatePlayerCreation = [
  // body('UserID').isInt().withMessage('User ID must be an integer'),
  body('ChallengeID').isInt().withMessage('Challenge ID must be an integer'),
  logValidationErrors,
];

const validatePlayerUpdate = [
  body('Value').optional().isInt().withMessage('Value must be an integer'),
  param('ID').isInt().withMessage('Player ID must be a valid integer'),
  logValidationErrors,
];

module.exports = {
  validatePlayerCreation,
  validatePlayerUpdate,
};
