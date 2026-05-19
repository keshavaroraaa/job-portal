const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, 'Validation failed', 400, errors.array());
    }

    const { user, token } = await authService.register(req.body);
    ApiResponse.created(res, { user, token }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, 'Validation failed', 400, errors.array());
    }

    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    ApiResponse.success(res, { user, token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    ApiResponse.success(res, { user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  ApiResponse.success(res, null, 'Logged out successfully');
};

module.exports = { register, login, getMe, logout };
