const express = require('express');
const {
  validateChallengeCreation,
  validateChallengeUpdate,
} = require('../middleware/challenge.middlewares');
const {
  createChallengeHandler,
  getChallengeHandler,
  updateChallengeHandler,
  deleteChallengeHandler,
  searchChallengeHandler,
  getOnGoingChallengesHandler,
} = require('../controllers/challenge.controller');
const { validationResult } = require('express-validator');
const verifyToken = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// Middleware to handle validation results
const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation errors occurred in challengeRoutes.', {
      errors: errors.array(),
    });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/challenges',
  validateChallengeCreation,
  validationHandler,
  verifyToken,
  (req, res, next) => {
    logger.info('POST /challenges - Creating a new challenge');
    next();
  },
  createChallengeHandler
);
router.get(
  '/challenges/:ID',
  (req, res, next) => {
    logger.info(`GET /challenges/${req.params.ID} - Retrieving challenge`);
    next();
  },
  getChallengeHandler
);
router.put(
  '/challenges/:ID',
  validateChallengeUpdate,
  validationHandler,
  (req, res, next) => {
    logger.info(`PUT /challenges/${req.params.ID} - Updating challenge`);
    next();
  },
  updateChallengeHandler
);
router.delete(
  '/challenges/:ID',
  (req, res, next) => {
    logger.info(`DELETE /challenges/${req.params.ID} - Deleting challenge`);
    next();
  },
  deleteChallengeHandler
);

router.get(
  '/challenges/search/:searchTerm',
  // verifyToken,
  (req, res, next) => {
    logger.info(
      `GET /challenges/search/${req.params.searchTerm} - Searching challenges`
    );
    next();
  },
  searchChallengeHandler
);

router.get(
  '/challenges/onGoing/category/:type',
  // verifyToken,
  (req, res, next) => {
    logger.info(
      `GET /challenges/onGoing/category/${req.params.type} - Getting ongoing challenges by category`
    );
    next();
  },
  getOnGoingChallengesHandler
);

module.exports = router;
