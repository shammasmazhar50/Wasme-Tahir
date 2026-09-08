const { Sequelize } = require('sequelize');
const path = require('path');

// For local development, we use SQLite. 
// For production on Hostinger, this will be changed to MySQL.
const sequelize = process.env.NODE_ENV === 'production' 
  ? new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'database.sqlite'),
      logging: false
    });

module.exports = sequelize;
