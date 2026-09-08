const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stat = sequelize.define('Stat', {
  platform: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
  label: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Stat;
