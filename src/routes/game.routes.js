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

const router = express.Router();

router.post('/', validateGameCreation, validationHandler, createGameHandler);
router.get('/:ID', getGameHandler);
router.put('/:ID', validateGameUpdate, validationHandler, updateGameHandler);
router.delete('/:ID', deleteGameHandler);

// Middleware to handle validation results
function validationHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = router;