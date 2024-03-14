const express = require('express');
const router = express.Router();
const authController = require('../controllers/googleLogin.controller');
const logger = require('../utils/logger');

router.get(
  '/',
  (req, res, next) => {
    logger.info('Redirecting to Google OAuth.');
    next();
  },
  authController.redirectToGoogle
);

router.get(
  '/callback',
  (req, res, next) => {
    logger.info('Handling Google OAuth callback.');
    next();
  },
  authController.handleGoogleCallback
);

router.post(
  '/signout',
  (req, res, next) => {
    logger.info('Signing out user.');
    next();
  },
  authController.signOut
);

module.exports = router;
