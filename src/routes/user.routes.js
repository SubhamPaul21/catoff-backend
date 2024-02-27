var express = require('express');
var router = express.Router();
let userController = require('../controllers/user.controller');

/* GET home page. */
router.route('/signup')
    .post(userController.signUp);

router.route('/login')
    .post(userController.login);

module.exports = router;
