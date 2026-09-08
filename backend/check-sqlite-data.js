const { Sequelize } = require('sequelize');
const path = require('path');

async function checkSQLiteData() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
  });

  try {
    await sequelize.authenticate();
    const tables = ['Brands', 'CaseStudies', 'ContactSubmissions', 'Demographics', 'Posts', 'Stats', 'Users'];
    
    console.log(`\n--- SQLITE DATA COUNT PER TABLE ---\n`);
    for (const table of tables) {
      try {
        const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`Table **${table}**: ${results[0].count} rows`);
      } catch (err) {
        console.log(`Table **${table}**: Error or doesn't exist`);
      }
    }
    await sequelize.close();
  } catch (err) {
    console.error('Error connecting to SQLite:', err);
  }
}

checkSQLiteData();
