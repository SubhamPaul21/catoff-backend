const { body, param } = require('express-validator');

const validatePlayerCreation = [
  body('userId').isInt().withMessage('User ID must be an integer'),
  body('challengeId').isInt().withMessage('Challenge ID must be an integer'),
  body('value').isInt().withMessage('Value must be an integer'),
];

const validatePlayerUpdate = [
  body('value').optional().isInt().withMessage('Value must be an integer'),
  param('id').isInt().withMessage('Player ID must be a valid integer'),
];

module.exports = {
  validatePlayerCreation,
  validatePlayerUpdate,
};
