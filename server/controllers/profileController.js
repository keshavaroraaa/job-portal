const { validationResult } = require('express-validator');
const profileService = require('../services/profileService');
const ApiResponse = require('../utils/ApiResponse');

const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, 'Validation failed', 400, errors.array());
    }
    const result = await profileService.updateProfile(req.user.id, req.user.role, req.body);
    ApiResponse.success(res, result, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, 'Validation failed', 400, errors.array());
    }
    const { currentPassword, newPassword } = req.body;
    const result = await profileService.changePassword(req.user.id, currentPassword, newPassword);
    ApiResponse.success(res, result, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    let data;
    if (req.user.role === 'employer') {
      data = await profileService.getEmployerDashboard(req.user.id);
    } else {
      data = await profileService.getSeekerDashboard(req.user.id);
    }
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, changePassword, getDashboard };
