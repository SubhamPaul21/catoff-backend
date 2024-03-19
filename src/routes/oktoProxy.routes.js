const express = require('express');
const oktoProxyController = require('../controllers/oktoProxy.controller');
const logger = require('../utils/logger');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.post(
  '/authenticate',
  verifyToken,
  (req, res, next) => {
    logger.info('POST /authenticate - Authenticate user from Okto');
    next();
  },
  oktoProxyController.authenticateOktoUser
);

router.post(
  '/set_pin',
  verifyToken,
  (req, res, next) => {
    logger.info('POST /set_pin - Setting new PIN for Okto user');
    next();
  },
  oktoProxyController.setNewPinOktoUser
);

router.post(
  '/create_wallet',
  verifyToken,
  (req, res, next) => {
    logger.info('POST /create_wallet - Creating wallet for Okto user');
    next();
  },
  oktoProxyController.createWalletForUser
);

router.post(
  '/refresh_token',
  verifyToken,
  (req, res, next) => {
    logger.info('POST /refresh_token - Refreshing tokens for Okto user');
    next();
  },
  oktoProxyController.refreshTokenForUser
);

module.exports = router;
