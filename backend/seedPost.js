const sequelize = require('./config/database');
const Post = require('./models/Post');

async function seedPost() {
  await sequelize.sync();
  
  await Post.create({
    title: 'My First Dynamic Editorial',
    slug: 'my-first-dynamic-editorial',
    content: '## Welcome to my new CMS!\nThis blog post was written and saved directly into the database using the new custom Admin panel. \n\nYou can format text with **bold**, *italics*, and even include links and images just like before.',
    excerpt: 'Welcome to the new CMS!',
    coverImage: '/images/IMG_6535.webp',
    published: true
  });
  
  console.log('Post seeded!');
  process.exit();
}

seedPost();
