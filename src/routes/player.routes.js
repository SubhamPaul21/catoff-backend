const express = require('express');
const {
  validatePlayerCreation,
  validatePlayerUpdate,
} = require('../middleware/player.middlewares');
const {
  createPlayerHandler,
  getPlayerHandler,
  updatePlayerHandler,
  deletePlayerHandler,
  getAllPlayersOfChallengeHandler,
} = require('../controllers/player.controller');
const { validationResult } = require('express-validator');
const verifyToken = require('../middleware/authMiddleware'); // Changed let to const
const logger = require('../utils/logger'); // Adjust the path as necessary

const router = express.Router();

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation errors occurred in player routes.', {
      errors: errors.array(),
    });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/',
  validatePlayerCreation,
  validationHandler,
  verifyToken,
  (req, res, next) => {
    logger.info('POST /players - Creating a new player');
    next();
  },
  createPlayerHandler
);

router.get(
  '/:ID',
  (req, res, next) => {
    logger.info(`GET /players/${req.params.ID} - Retrieving player`);
    next();
  },
  getPlayerHandler
);

router.put(
  '/:ID',
  validatePlayerUpdate,
  validationHandler,
  (req, res, next) => {
    logger.info(`PUT /players/${req.params.ID} - Updating player`);
    next();
  },
  updatePlayerHandler
);

router.delete(
  '/:ID',
  (req, res, next) => {
    logger.info(`DELETE /players/${req.params.ID} - Deleting player`);
    next();
  },
  deletePlayerHandler
);

router.get(
  '/challenge/:ID',
  // verifyToken,
  (req, res, next) => {
    logger.info(
      `GET /players/challenge/${req.params.ID} - Retrieving all players of a challenge`
    );
    next();
  },
  getAllPlayersOfChallengeHandler
);

module.exports = router;
