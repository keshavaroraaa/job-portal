const express = require('express');
const router = express.Router();
const {
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getAllJobs,
  getJobById,
  getCategories,
} = require('../controllers/jobController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleMiddleware');
const { createJobValidator } = require('../validators/jobValidator');
const { ROLES } = require('../utils/constants');

router.get('/', getAllJobs);
router.get('/categories', getCategories);
router.get('/my-jobs', authenticate, authorize(ROLES.EMPLOYER), getMyJobs);
router.get('/:id', getJobById);
router.post('/', authenticate, authorize(ROLES.EMPLOYER), createJobValidator, createJob);
router.put('/:id', authenticate, authorize(ROLES.EMPLOYER), updateJob);
router.delete('/:id', authenticate, authorize(ROLES.EMPLOYER), deleteJob);

module.exports = router;
