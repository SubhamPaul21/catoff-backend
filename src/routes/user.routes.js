var express = require('express');
var router = express.Router();
let userController = require('../controllers/user.controller');
let verifyToken = require('../middleware/authMiddleware')

/* GET home page. */
router.route('/addUserDetails')
    .post(verifyToken,userController.addUserDetails);

router.route('/login')
    .post(userController.login);

module.exports = router;
