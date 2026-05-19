const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiResponse = require('../utils/ApiResponse');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found.', 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, 'Account deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.error(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Token expired.', 401);
    }
    return ApiResponse.error(res, 'Authentication failed.', 500);
  }
};

module.exports = authenticate;
