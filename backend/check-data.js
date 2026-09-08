const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'ShammasSh123',
      database: process.env.DB_NAME || 'wasmetahir_db'
    });

    console.log(`\n--- DATA COUNT PER TABLE ---\n`);

    const tables = ['brands', 'casestudies', 'contactsubmissions', 'demographics', 'posts', 'stats', 'users'];
    
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
      console.log(`Table **${table}**: ${rows[0].count} rows`);
    }

    await connection.end();
  } catch (error) {
    console.error('Error checking data:', error.message);
    process.exit(1);
  }
}

checkData();
