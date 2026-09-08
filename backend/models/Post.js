const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  excerpt: { type: DataTypes.TEXT },
  coverImage: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, defaultValue: 'EDITORIAL' },
  published: { type: DataTypes.BOOLEAN, defaultValue: false },
  publishedAt: { type: DataTypes.DATE }
}, {
  indexes: [
    { unique: true, fields: ['slug'] },
    { fields: ['published'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Post;
