const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Protect the route and allow only admin access
router.get('/users', authMiddleware, roleMiddleware(['admin']), authController.getAllUsers);

module.exports = router;
