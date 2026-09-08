const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

async function migrateData() {
  const sqlite = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
  });

  const mysql = new Sequelize(
    process.env.DB_NAME || 'wasmetahir_db', 
    process.env.DB_USER || 'root', 
    process.env.DB_PASS || 'ShammasSh123', 
    {
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: 'mysql',
      logging: false
    }
  );

  const tables = [
    { sqlite: 'Brands', mysql: 'brands' },
    { sqlite: 'CaseStudies', mysql: 'casestudies' },
    { sqlite: 'ContactSubmissions', mysql: 'contactsubmissions' },
    { sqlite: 'Demographics', mysql: 'demographics' },
    { sqlite: 'Posts', mysql: 'posts' },
    { sqlite: 'Stats', mysql: 'stats' },
    { sqlite: 'Users', mysql: 'users' }
  ];

  try {
    await sqlite.authenticate();
    await mysql.authenticate();
    
    // Disable foreign key checks just in case
    await mysql.query('SET FOREIGN_KEY_CHECKS = 0;');

    for (const table of tables) {
      console.log(`Migrating ${table.sqlite}...`);
      
      const [rows] = await sqlite.query(`SELECT * FROM ${table.sqlite}`);
      
      if (rows.length === 0) {
        console.log(`  No data to migrate for ${table.sqlite}`);
        continue;
      }

      for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        
        const placeholders = values.map(() => '?').join(', ');
        const query = `INSERT IGNORE INTO ${table.mysql} (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;
        
        await mysql.query(query, { replacements: values });
      }
      
      console.log(`  Migrated ${rows.length} rows to ${table.mysql}`);
    }

    await mysql.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('\nMigration complete!');
    
    await sqlite.close();
    await mysql.close();
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrateData();
