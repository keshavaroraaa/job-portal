const User = require('./User');
const EmployerProfile = require('./EmployerProfile');
const SeekerProfile = require('./SeekerProfile');
const Job = require('./Job');
const Application = require('./Application');

User.hasOne(EmployerProfile, { foreignKey: 'userId', as: 'employerProfile', onDelete: 'CASCADE' });
EmployerProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(SeekerProfile, { foreignKey: 'userId', as: 'seekerProfile', onDelete: 'CASCADE' });
SeekerProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Job, { foreignKey: 'employerId', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

User.hasMany(Application, { foreignKey: 'seekerId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'seekerId', as: 'seeker' });

module.exports = {
  User,
  EmployerProfile,
  SeekerProfile,
  Job,
  Application,
};
