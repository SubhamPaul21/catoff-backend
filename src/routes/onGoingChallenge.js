const express = require('express');
const router = express.Router();
const playerController = require('../controllers/onGoingChallenge.controller');
const logger = require('../utils/logger');

router.get(
  '/:userId/ongoing-challenges',
  (req, res, next) => {
    logger.info(
      `GET /players/${req.params.userId}/ongoing-challenges - Retrieving ongoing challenges for user`
    );
    next();
  },
  playerController.getOngoingChallengesByUser
);

module.exports = router;
