const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'ShammasSh123',
      database: process.env.DB_NAME || 'wasmetahir_db'
    });

    const [rows] = await connection.query(`SELECT id, username, password, role FROM users`);
    console.log(`\n--- USERS DATA ---\n`);
    for (const row of rows) {
      console.log(`ID: ${row.id}, Username: ${row.username}, Role: ${row.role}, Password (hashed): ${row.password.substring(0, 10)}...`);
    }

    await connection.end();
  } catch (error) {
    console.error('Error checking users:', error.message);
    process.exit(1);
  }
}

checkUsers();
