// challengeRoutes.js
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
  getChallengesHandler
} = require('../controllers/challenge.controller');
const { validationResult } = require('express-validator');
let verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/challenges',
  validateChallengeCreation,
  validationHandler,
  createChallengeHandler
);
router.get('/challenges/:ID', getChallengeHandler);
router.put(
  '/challenges/:ID',
  validateChallengeUpdate,
  validationHandler,
  updateChallengeHandler
);
router.delete('/challenges/:ID', deleteChallengeHandler);

router.get('/challenges/search/:searchTerm',verifyToken,searchChallengeHandler);

router.get('/challenges/onGoing/category/:type', getChallengesHandler);

// Middleware to handle validation results
function validationHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = router;
