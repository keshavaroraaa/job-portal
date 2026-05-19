const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SeekerProfile = sequelize.define('SeekerProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(200),
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
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumeUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  linkedInUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  githubUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'seeker_profiles',
});

module.exports = SeekerProfile;
