const { Sequelize } = require('sequelize');
const path = require('path');

// For local development, we use SQLite. 
// For production, we use MySQL by default but allow overriding to SQLite.
const dialect = process.env.DB_DIALECT || 'mysql';

const sequelize = (process.env.NODE_ENV === 'production' && dialect === 'mysql')
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
