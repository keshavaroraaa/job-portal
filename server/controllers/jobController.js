const { validationResult } = require('express-validator');
const jobService = require('../services/jobService');
const ApiResponse = require('../utils/ApiResponse');

const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, 'Validation failed', 400, errors.array());
    }
    const job = await jobService.createJob(req.user.id, req.body);
    ApiResponse.created(res, { job }, 'Job posted successfully');
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.user.id, req.body);
    ApiResponse.success(res, { job }, 'Job updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id, req.user.id);
    ApiResponse.success(res, null, 'Job deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getMyJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await jobService.getEmployerJobs(req.user.id, page, limit);
    ApiResponse.paginated(res, result.jobs, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, jobType, location, experienceLevel, salaryMin, salaryMax } = req.query;
    const result = await jobService.getAllJobs({ page, limit, search, category, jobType, location, experienceLevel, salaryMin, salaryMax });
    ApiResponse.paginated(res, result.jobs, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    ApiResponse.success(res, { job });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await jobService.getJobCategories();
    ApiResponse.success(res, { categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { createJob, updateJob, deleteJob, getMyJobs, getAllJobs, getJobById, getCategories };
