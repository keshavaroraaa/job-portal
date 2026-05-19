const express = require('express');
const router = express.Router();
const {
  apply,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getAllEmployerApplications,
} = require('../controllers/applicationController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');
const { ROLES } = require('../utils/constants');

router.get('/my-applications', authenticate, authorize(ROLES.JOB_SEEKER), getMyApplications);
router.get('/employer-all', authenticate, authorize(ROLES.EMPLOYER), getAllEmployerApplications);
router.post('/:jobId/apply', authenticate, authorize(ROLES.JOB_SEEKER), upload.single('resume'), apply);
router.get('/:jobId', authenticate, authorize(ROLES.EMPLOYER), getJobApplications);
router.put('/:id/status', authenticate, authorize(ROLES.EMPLOYER), updateApplicationStatus);

module.exports = router;
