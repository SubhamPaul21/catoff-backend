const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

/* GET home page. */
router.route('/addUserDetails').post(
  verifyToken,
  (req, res, next) => {
    logger.info('POST /user/addUserDetails - Adding user details');
    next();
  },
  userController.addUserDetails
);

router.route('/login').post((req, res, next) => {
  logger.info('POST /user/login - Logging in');
  next();
}, userController.login);

module.exports = router;
