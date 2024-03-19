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

module.exports = router;
