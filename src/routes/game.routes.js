const express = require('express');
const {
  validateGameCreation,
  validateGameUpdate,
} = require('../middleware/game.middlewares');
const {
  createGameHandler,
  getGameHandler,
  updateGameHandler,
  deleteGameHandler,
} = require('../controllers/game.controller');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger'); // Adjust the path as necessary

const router = express.Router();

// Middleware to handle validation results
const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation errors occurred in game routes.', {
      errors: errors.array(),
    });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/',
  validateGameCreation,
  validationHandler,
  (req, res, next) => {
    logger.info('POST /games - Creating a new game');
    next();
  },
  createGameHandler
);
router.get(
  '/:ID',
  (req, res, next) => {
    logger.info(`GET /games/${req.params.ID} - Retrieving game`);
    next();
  },
  getGameHandler
);
router.put(
  '/:ID',
  validateGameUpdate,
  validationHandler,
  (req, res, next) => {
    logger.info(`PUT /games/${req.params.ID} - Updating game`);
    next();
  },
  updateGameHandler
);
router.delete(
  '/:ID',
  (req, res, next) => {
    logger.info(`DELETE /games/${req.params.ID} - Deleting game`);
    next();
  },
  deleteGameHandler
);

module.exports = router;
