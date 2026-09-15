const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
  name: { type: DataTypes.STRING, allowNull: false },
  link: { type: DataTypes.STRING },
  logoUrl: { type: DataTypes.STRING }, // if null, can just render text
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Brand;
