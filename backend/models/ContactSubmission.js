const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactSubmission = sequelize.define('ContactSubmission', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING },
  inquiry: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = ContactSubmission;
