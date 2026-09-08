const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Demographic = sequelize.define('Demographic', {
  category: { type: DataTypes.STRING, allowNull: false }, // Gender, Age, Location
  data: { type: DataTypes.TEXT }, // Could store a string like '85% Female / 15% Male' or '1. NY\n2. London'
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Demographic;
