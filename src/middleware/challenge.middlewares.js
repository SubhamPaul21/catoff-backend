// challengeValidation.js
const { body, param } = require('express-validator');

const validateChallengeCreation = [
  body('challengeName')
    .isLength({ min: 1 })
    .withMessage('Challenge name is required'),
  body('challengeDescription')
    .isLength({ min: 1 })
    .withMessage('Challenge description is required'),
  body('challengeCreator')
    .isInt()
    .withMessage('Valid challenge creator is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('EndDate').isISO8601().withMessage('Valid end date is required'),
  body('challengeType').isInt().withMessage('Valid challenge type is required'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  // Winners array validation could be more complex depending on requirements
];

const validateChallengeUpdate = [
  body('challengeName')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Challenge name must be provided'),
  body('challengeDescription')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Challenge description must be provided'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('EndDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  param('id').isInt().withMessage('ID must be a valid integer'),
];

module.exports = {
  validateChallengeCreation,
  validateChallengeUpdate,
};
