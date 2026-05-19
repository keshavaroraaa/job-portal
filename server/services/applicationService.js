const { Application, Job, User, SeekerProfile, EmployerProfile } = require('../models');
const AppError = require('../utils/AppError');

class ApplicationService {
  async apply(jobId, seekerId, { coverLetter, resumeUrl }) {
    const job = await Job.findByPk(jobId);
    if (!job) throw new AppError('Job not found.', 404);
    if (job.status !== 'open') throw new AppError('This job is no longer accepting applications.', 400);

    const existing = await Application.findOne({ where: { jobId, seekerId } });
    if (existing) throw new AppError('You have already applied for this job.', 409);

    const application = await Application.create({
      jobId,
      seekerId,
      coverLetter,
      resumeUrl,
    });

    return application;
  }

  async getSeekerApplications(seekerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Application.findAndCountAll({
      where: { seekerId },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'employer',
              attributes: ['id', 'name'],
              include: [
                {
                  model: EmployerProfile,
                  as: 'employerProfile',
                  attributes: ['companyName', 'logo', 'location'],
                },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
    });
    return { applications: rows, total: count, page: parseInt(page), limit: parseInt(limit) };
  }

  async getJobApplications(jobId, employerId, page = 1, limit = 10) {
    const job = await Job.findOne({ where: { id: jobId, employerId } });
    if (!job) throw new AppError('Job not found or unauthorized.', 404);

    const offset = (page - 1) * limit;
    const { count, rows } = await Application.findAndCountAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: SeekerProfile,
              as: 'seekerProfile',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
    });
    return { applications: rows, total: count, page: parseInt(page), limit: parseInt(limit), job };
  }

  async updateApplicationStatus(applicationId, employerId, status) {
    const application = await Application.findByPk(applicationId, {
      include: [
        {
          model: Job,
          as: 'job',
          where: { employerId },
        },
      ],
    });
    if (!application) throw new AppError('Application not found or unauthorized.', 404);

    await application.update({ status });
    return application;
  }

  async getEmployerApplications(employerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Application.findAndCountAll({
      include: [
        {
          model: Job,
          as: 'job',
          where: { employerId },
          include: [
            {
              model: User,
              as: 'employer',
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: SeekerProfile,
              as: 'seekerProfile',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
    });
    return { applications: rows, total: count, page: parseInt(page), limit: parseInt(limit) };
  }
}

module.exports = new ApplicationService();
