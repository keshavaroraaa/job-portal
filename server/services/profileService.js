const { User, EmployerProfile, SeekerProfile } = require('../models');
const AppError = require('../utils/AppError');

class ProfileService {
  async updateProfile(userId, role, updates) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User not found.', 404);

    if (role === 'employer') {
      const profile = await EmployerProfile.findOne({ where: { userId } });
      if (!profile) throw new AppError('Employer profile not found.', 404);
      await profile.update(updates);
      return { user, profile };
    } else {
      const profile = await SeekerProfile.findOne({ where: { userId } });
      if (!profile) throw new AppError('Seeker profile not found.', 404);

      const profileUpdates = {};
      const allowedFields = ['phone', 'location', 'title', 'skills', 'experience', 'education', 'bio', 'linkedInUrl', 'githubUrl'];
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          profileUpdates[field] = updates[field];
        }
      }
      await profile.update(profileUpdates);
      return { user, profile };
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User not found.', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect.', 400);

    user.password = newPassword;
    await user.save();
    return { message: 'Password changed successfully.' };
  }

  async getEmployerDashboard(employerId) {
    const totalJobs = await require('../models').Job.count({ where: { employerId } });
    const openJobs = await require('../models').Job.count({ where: { employerId, status: 'open' } });
    const allApplications = await require('../models').Application.count({
      include: [
        {
          model: require('../models').Job,
          as: 'job',
          where: { employerId },
        },
      ],
    });
    const recentApplications = await require('../models').Application.count({
      include: [
        {
          model: require('../models').Job,
          as: 'job',
          where: { employerId },
        },
      ],
      where: {
        status: 'pending',
      },
    });

    const recentJobs = await require('../models').Job.findAll({
      where: { employerId },
      include: [
        {
          model: require('../models').Application,
          as: 'applications',
          attributes: ['id', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return { totalJobs, openJobs, totalApplications: allApplications, pendingApplications: recentApplications, recentJobs };
  }

  async getSeekerDashboard(seekerId) {
    const totalApplications = await require('../models').Application.count({ where: { seekerId } });
    const pendingApps = await require('../models').Application.count({ where: { seekerId, status: 'pending' } });
    const reviewedApps = await require('../models').Application.count({ where: { seekerId, status: 'reviewed' } });
    const shortlistedApps = await require('../models').Application.count({ where: { seekerId, status: 'shortlisted' } });

    const recentApplications = await require('../models').Application.findAll({
      where: { seekerId },
      include: [
        {
          model: require('../models').Job,
          as: 'job',
          include: [
            {
              model: require('../models').User,
              as: 'employer',
              attributes: ['id', 'name'],
              include: [
                {
                  model: require('../models').EmployerProfile,
                  as: 'employerProfile',
                  attributes: ['companyName', 'logo'],
                },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return { totalApplications, pendingApplications: pendingApps, reviewedApplications: reviewedApps, shortlistedApplications: shortlistedApps, recentApplications };
  }
}

module.exports = new ProfileService();
