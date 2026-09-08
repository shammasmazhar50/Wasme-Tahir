const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CaseStudy = sequelize.define('CaseStudy', {
  brandName: { type: DataTypes.STRING, allowNull: false },
  campaignTitle: { type: DataTypes.STRING, allowNull: false },
  coverImage: { type: DataTypes.STRING },
  theBrief: { type: DataTypes.TEXT },
  theConcept: { type: DataTypes.TEXT },
  stat1Value: { type: DataTypes.STRING },
  stat1Label: { type: DataTypes.STRING },
  stat2Value: { type: DataTypes.STRING },
  stat2Label: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = CaseStudy;
