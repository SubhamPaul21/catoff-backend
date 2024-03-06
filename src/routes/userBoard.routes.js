const express = require('express');
const router = express.Router();
const {
  getUserCurrentTable,
  getUserProgressGraph,
  getUserDetails,
} = require('../controllers/userBoard.controller');
const verifyToken = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

router.get(
  '/dashboard/userCurrentTable',
  verifyToken,
  (req, res, next) => {
    logger.info(
      'GET /dashboard/userCurrentTable - Retrieving current user table'
    );
    next();
  },
  getUserCurrentTable
);
router.get(
  '/dashboard/userProgressGraph/:period',
  verifyToken,
  (req, res, next) => {
    logger.info(
      `GET /dashboard/userProgressGraph/${req.params.period} - Retrieving user progress graph`
    );
    next();
  },
  getUserProgressGraph
);
router.get(
  '/dashboard/userDetails',
  verifyToken,
  (req, res, next) => {
    logger.info('GET /dashboard/userDetails - Retrieving user details');
    next();
  },
  getUserDetails
);

module.exports = router;
