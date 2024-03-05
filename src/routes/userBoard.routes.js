const express = require('express');
const router = express.Router();
const { getUserCurrentTable } = require('../controllers/userBoard.controller');
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard/userCurrentTable', verifyToken, getUserCurrentTable);

module.exports = router;
