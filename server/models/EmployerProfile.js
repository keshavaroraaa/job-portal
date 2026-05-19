const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmployerProfile = sequelize.define('EmployerProfile', {
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
  companyName: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  companyWebsite: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  companyDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  companySize: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'employer_profiles',
});

module.exports = EmployerProfile;
