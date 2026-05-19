const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { JOB_STATUS, JOB_TYPES, EXPERIENCE_LEVELS } = require('../utils/constants');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Job title is required' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Job description is required' },
    },
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Location is required' },
    },
  },
  salaryMin: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  salaryMax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  salaryCurrency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  jobType: {
    type: DataTypes.ENUM(...Object.values(JOB_TYPES)),
    defaultValue: JOB_TYPES.FULL_TIME,
  },
  experienceLevel: {
    type: DataTypes.ENUM(...Object.values(EXPERIENCE_LEVELS)),
    defaultValue: EXPERIENCE_LEVELS.ENTRY,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('skills');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('skills', JSON.stringify(val));
    },
  },
  vacancies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  status: {
    type: DataTypes.ENUM(...Object.values(JOB_STATUS)),
    defaultValue: JOB_STATUS.OPEN,
  },
  applicationDeadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'jobs',
  indexes: [
    { fields: ['employer_id'] },
    { fields: ['status'] },
    { fields: ['job_type'] },
    { fields: ['category'] },
    { fields: ['location'] },
  ],
});

module.exports = Job;
