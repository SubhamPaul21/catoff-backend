const { body, param } = require('express-validator');

const validateGameCreation = [
  body('GameType').isInt().withMessage('GameType must be an integer'),
  body('GameDescription')
    .isLength({ min: 1 })
    .withMessage('GameDescription is required'),
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
];

module.exports = {
  validateGameCreation,
  validateGameUpdate,
};
