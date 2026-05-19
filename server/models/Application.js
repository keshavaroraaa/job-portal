const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { APPLICATION_STATUS } = require('../utils/constants');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  seekerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(APPLICATION_STATUS)),
    defaultValue: APPLICATION_STATUS.PENDING,
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumeUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'applications',
  indexes: [
    { fields: ['job_id'] },
    { fields: ['seeker_id'] },
    { unique: true, fields: ['job_id', 'seeker_id'] },
  ],
});

module.exports = Application;
