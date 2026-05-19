const { Op } = require('sequelize');
const { Job, Application, User, EmployerProfile } = require('../models');
const AppError = require('../utils/AppError');

class JobService {
  async createJob(employerId, jobData) {
    const job = await Job.create({
      ...jobData,
      employerId,
    });
    return job;
  }

  async updateJob(jobId, employerId, jobData) {
    const job = await Job.findOne({ where: { id: jobId, employerId } });
    if (!job) throw new AppError('Job not found or unauthorized.', 404);
    await job.update(jobData);
    return job;
  }

  async deleteJob(jobId, employerId) {
    const job = await Job.findOne({ where: { id: jobId, employerId } });
    if (!job) throw new AppError('Job not found or unauthorized.', 404);
    await job.destroy();
    return { message: 'Job deleted successfully.' };
  }

  async getEmployerJobs(employerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Job.findAndCountAll({
      where: { employerId },
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
    });
    return { jobs: rows, total: count, page: parseInt(page), limit: parseInt(limit) };
  }

  async getAllJobs({ page = 1, limit = 10, search, category, jobType, location, experienceLevel, salaryMin, salaryMax }) {
    const offset = (page - 1) * limit;
    const where = { status: 'open' };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { skills: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category) where.category = category;
    if (jobType) where.jobType = jobType;
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (salaryMin) where.salaryMin = { [Op.gte]: salaryMin };
    if (salaryMax) where.salaryMax = { [Op.lte]: salaryMax };

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'name'],
          include: [
            {
              model: EmployerProfile,
              as: 'employerProfile',
              attributes: ['companyName', 'logo', 'location', 'industry'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
    });

    return { jobs: rows, total: count, page: parseInt(page), limit: parseInt(limit) };
  }

  async getJobById(jobId) {
    const job = await Job.findByPk(jobId, {
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: EmployerProfile,
              as: 'employerProfile',
            },
          ],
        },
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status'],
        },
      ],
    });
    if (!job) throw new AppError('Job not found.', 404);
    return job;
  }

  async getJobCategories() {
    const categories = await Job.findAll({
      attributes: ['category'],
      where: { category: { [Op.ne]: null } },
      group: ['category'],
    });
    return categories.map((c) => c.category).filter(Boolean);
  }
}

module.exports = new JobService();
