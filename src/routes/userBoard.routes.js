const express = require('express');
const router = express.Router();
const {
  getUserCurrentTable,
  getUserProgressGraph,
} = require('../controllers/userBoard.controller');
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard/userCurrentTable', verifyToken, getUserCurrentTable);
router.get(
  '/dashboard/userProgressGraph/:period',
  verifyToken,
  getUserProgressGraph
);

module.exports = router;
