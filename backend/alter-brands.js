require('dotenv').config();
const sequelize = require('./config/database');
const Brand = require('./models/Brand');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.query('ALTER TABLE Brands ADD COLUMN link VARCHAR(255);');
    console.log('Altered table Brands');
    process.exit(0);
  } catch (err) {
    if (err.message.includes('Duplicate column name')) {
      console.log('Column already exists');
      process.exit(0);
    }
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
