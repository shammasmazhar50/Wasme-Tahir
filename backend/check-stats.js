const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkStats() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'ShammasSh123',
      database: process.env.DB_NAME || 'wasmetahir_db'
    });

    const [rows] = await connection.query(`SELECT * FROM stats`);
    console.log(`\n--- STATS DATA ---\n`);
    for (const row of rows) {
      console.log(`Platform: ${row.platform}, Value: ${row.value}, Label: ${row.label}`);
    }

    await connection.end();
  } catch (error) {
    console.error('Error checking stats:', error.message);
    process.exit(1);
  }
}

checkStats();
