const jwt = require('jsonwebtoken');
const { User, EmployerProfile, SeekerProfile } = require('../models');
const AppError = require('../utils/AppError');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async register({ name, email, password, role, ...profileData }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered.', 409);
    }

    const user = await User.create({ name, email, password, role });

    if (role === 'employer') {
      await EmployerProfile.create({
        userId: user.id,
        companyName: profileData.companyName || name,
        companyDescription: profileData.companyDescription || '',
        companySize: profileData.companySize || '',
        industry: profileData.industry || '',
        location: profileData.location || '',
      });
    } else {
      await SeekerProfile.create({
        userId: user.id,
        phone: '',
        location: '',
        title: '',
        skills: [],
        bio: '',
      });
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account has been deactivated.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: EmployerProfile,
          as: 'employerProfile',
          required: false,
        },
        {
          model: SeekerProfile,
          as: 'seekerProfile',
          required: false,
        },
      ],
    });
    if (!user) throw new AppError('User not found.', 404);
    return user;
  }
}

module.exports = new AuthService();
