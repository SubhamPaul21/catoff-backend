// challengeRoutes.js
const express = require('express');
const { validateChallengeCreation, validateChallengeUpdate } = require('../middleware/challenge.middlewares');
const { createChallengeHandler, getChallengeHandler, updateChallengeHandler, deleteChallengeHandler } = require('../controllers/challenge.controller');
const { validationResult } = require('express-validator');

const router = express.Router();

router.post('/challenges', validateChallengeCreation, validationHandler, createChallengeHandler);
router.get('/challenges/:id', getChallengeHandler);
router.put('/challenges/:id', validateChallengeUpdate, validationHandler, updateChallengeHandler);
router.delete('/challenges/:id', deleteChallengeHandler);

// Middleware to handle validation results
function validationHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = router;
