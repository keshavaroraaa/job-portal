const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../validators/authValidator');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;
