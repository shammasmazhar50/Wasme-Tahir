const sequelize = require('./config/database');
const Stat = require('./models/Stat');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true });
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    username: 'admin',
    password: hashedPassword
  });

  await Stat.bulkCreate([
    { platform: 'TikTok', value: '75M+', label: 'TikTok Views', order: 1 },
    { platform: 'Instagram', value: '117M+', label: 'Instagram Views', order: 2 },
    { platform: 'Facebook', value: '8M+', label: 'Facebook Views', order: 3 },
    { platform: 'Youtube', value: '32M+', label: 'Youtube Views', order: 4 }
  ]);
  
  console.log('Database seeded with admin user (admin/admin123)!');
  process.exit();
}

seed();
