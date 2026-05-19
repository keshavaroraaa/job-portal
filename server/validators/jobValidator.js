const { body } = require('express-validator');
const { JOB_TYPES, EXPERIENCE_LEVELS } = require('../utils/constants');

const createJobValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  body('jobType')
    .optional()
    .isIn(Object.values(JOB_TYPES)).withMessage('Invalid job type'),
  body('experienceLevel')
    .optional()
    .isIn(Object.values(EXPERIENCE_LEVELS)).withMessage('Invalid experience level'),
  body('salaryMin')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum salary must be a positive number'),
  body('salaryMax')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum salary must be a positive number'),
  body('category')
    .optional()
    .trim(),
  body('vacancies')
    .optional()
    .isInt({ min: 1 }).withMessage('Vacancies must be at least 1'),
  body('applicationDeadline')
    .optional()
    .isDate().withMessage('Invalid date format'),
];

module.exports = { createJobValidator };
