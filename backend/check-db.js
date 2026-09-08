const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'ShammasSh123',
      database: process.env.DB_NAME || 'wasmetahir_db'
    });

    console.log(`\n--- DATABASE TABLES & ATTRIBUTES ---\n`);

    const [tables] = await connection.query("SHOW TABLES");
    const dbName = process.env.DB_NAME || 'wasmetahir_db';
    const tableKey = `Tables_in_${dbName}`;

    for (const row of tables) {
      const tableName = row[tableKey] || Object.values(row)[0];
      console.log(`Table: **${tableName}**`);
      
      const [columns] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
      for (const col of columns) {
        console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
      }
      console.log('');
    }

    await connection.end();
  } catch (error) {
    console.error('Error checking database:', error.message);
    process.exit(1);
  }
}

checkDatabase();
