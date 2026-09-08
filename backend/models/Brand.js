const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
  name: { type: DataTypes.STRING, allowNull: false },
  logoUrl: { type: DataTypes.STRING }, // if null, can just render text
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Brand;
