const Post = require('../models/Post');

exports.getSitemap = async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { published: true } });
    const BASE_URL = 'https://wasmetahir.com';
    
    // Static Pages
    const staticPages = [
      '',
      '/about',
      '/editorial',
      '/collaborations',
      '/press',
      '/contact'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static routes
    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${page}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic blog posts
    posts.forEach(post => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/post/${post.slug}</loc>\n`;
      xml += `    <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};
