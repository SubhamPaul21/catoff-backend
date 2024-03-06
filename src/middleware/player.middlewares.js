const { body, param } = require('express-validator');

const validatePlayerCreation = [
  body('UserID').isInt().withMessage('User ID must be an integer'),
  body('ChallengeID').isInt().withMessage('Challenge ID must be an integer'),
];

const validatePlayerUpdate = [
  body('Value').optional().isInt().withMessage('Value must be an integer'),
  param('ID').isInt().withMessage('Player ID must be a valid integer'),
];

module.exports = {
  validatePlayerCreation,
  validatePlayerUpdate,
};
