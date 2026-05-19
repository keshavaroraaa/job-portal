const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, getDashboard } = require('../controllers/profileController');
const authenticate = require('../middleware/auth');
const { changePasswordValidator } = require('../validators/authValidator');
const { updateEmployerProfileValidator, updateSeekerProfileValidator } = require('../validators/profileValidator');

router.get('/dashboard', authenticate, getDashboard);
router.put('/update', authenticate, (req, res, next) => {
  const validators = req.user.role === 'employer' ? updateEmployerProfileValidator : updateSeekerProfileValidator;
  const run = validators.map(v => v.run(req));
  Promise.all(run).then(() => next()).catch(next);
}, updateProfile);
router.put('/change-password', authenticate, changePasswordValidator, changePassword);

module.exports = router;
