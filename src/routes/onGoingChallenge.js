// routes/player.routes.js

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/onGoingChallenge.controller');

router.get(
  '/:userId/ongoing-challenges',
  playerController.getOngoingChallengesByUser
);

module.exports = router;
