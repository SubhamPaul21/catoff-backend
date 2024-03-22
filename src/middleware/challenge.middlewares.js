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

const validateChallengeCreation = [
  body('ChallengeName')
    .isLength({ min: 1 })
    .withMessage('Challenge name is required'),
  body('ChallengeDescription')
    .isLength({ min: 1 })
    .withMessage('Challenge description is required'),
  body('ChallengeCreator')
    .isInt()
    .withMessage('Valid challenge creator is required'),
  body('StartDate').isInt().withMessage('Valid start date is required'),
  body('EndDate').isInt().withMessage('Valid end date is required'),
  body('GameID').isInt().withMessage('Valid Game type is required'),
  body('IsActive').isBoolean().withMessage('isActive must be a boolean'),
  body('MaxParticipants').isInt().withMessage('MaxParticipant must be int'),
  body('Wager').isInt().withMessage('Wager must be defined'),
  body('Target').isInt().withMessage('Target must be int'),

  logValidationErrors,
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
  logValidationErrors,
];

module.exports = {
  validateChallengeCreation,
  validateChallengeUpdate,
};
