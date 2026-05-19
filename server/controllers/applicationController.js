const applicationService = require('../services/applicationService');
const ApiResponse = require('../utils/ApiResponse');

const apply = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const application = await applicationService.apply(jobId, req.user.id, { coverLetter, resumeUrl });
    ApiResponse.created(res, { application }, 'Application submitted successfully');
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await applicationService.getSeekerApplications(req.user.id, page, limit);
    ApiResponse.paginated(res, result.applications, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

const getJobApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await applicationService.getJobApplications(req.params.jobId, req.user.id, page, limit);
    ApiResponse.paginated(res, result.applications, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await applicationService.updateApplicationStatus(req.params.id, req.user.id, status);
    ApiResponse.success(res, { application }, 'Application status updated');
  } catch (error) {
    next(error);
  }
};

const getAllEmployerApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await applicationService.getEmployerApplications(req.user.id, page, limit);
    ApiResponse.paginated(res, result.applications, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

module.exports = { apply, getMyApplications, getJobApplications, updateApplicationStatus, getAllEmployerApplications };
