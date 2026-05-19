const { body } = require('express-validator');

const updateEmployerProfileValidator = [
  body('companyName')
    .optional()
    .trim()
    .notEmpty().withMessage('Company name cannot be empty'),
  body('companyWebsite')
    .optional()
    .trim()
    .isURL().withMessage('Invalid URL format'),
  body('phone')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim(),
  body('industry')
    .optional()
    .trim(),
  body('companySize')
    .optional()
    .trim(),
  body('companyDescription')
    .optional()
    .trim(),
];

const updateSeekerProfileValidator = [
  body('title')
    .optional()
    .trim(),
  body('phone')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim(),
  body('bio')
    .optional()
    .trim(),
  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array'),
  body('experience')
    .optional()
    .isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('education')
    .optional()
    .trim(),
  body('linkedInUrl')
    .optional()
    .trim(),
  body('githubUrl')
    .optional()
    .trim(),
];

module.exports = {
  updateEmployerProfileValidator,
  updateSeekerProfileValidator,
};
