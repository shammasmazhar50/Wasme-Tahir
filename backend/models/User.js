const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'author' }, // 'admin' or 'author'
  mfaSecret: { type: DataTypes.STRING, allowNull: true },
  mfaEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  indexes: [
    { unique: true, fields: ['username'] }
  ]
});

module.exports = User;
