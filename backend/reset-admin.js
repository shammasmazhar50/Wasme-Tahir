const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'ShammasSh123',
      database: process.env.DB_NAME || 'wasmetahir_db'
    });

    const newPassword = 'SecureAdminPass123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await connection.query(
      `UPDATE users SET password = ? WHERE username = 'admin'`,
      [hashedPassword]
    );

    console.log(`\nPassword for user 'admin' successfully reset to: ${newPassword}\n`);

    await connection.end();
  } catch (error) {
    console.error('Error resetting admin:', error.message);
    process.exit(1);
  }
}

resetAdmin();
