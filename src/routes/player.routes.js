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
} = require('../controllers/player.controller');
const { validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/',
  validatePlayerCreation,
  validationHandler,
  createPlayerHandler
);
router.get('/:id', getPlayerHandler);
router.put(
  '/:id',
  validatePlayerUpdate,
  validationHandler,
  updatePlayerHandler
);
router.delete('/:id', deletePlayerHandler);

// Middleware to handle validation results, similar to challengeRoutes
function validationHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = router;
