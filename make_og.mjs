import sharp from 'sharp';

const inputPath = 'C:/Users/SHAMMAS MAZHAR/.gemini/antigravity-ide/brain/748f5fd5-ac30-44fe-a86b-3a9d5577f9e9/.user_uploaded/media_1788273342029.jpg';
const outputPath = 'D:/Projects/Wasme Tahir/public/og-image.jpg';

sharp(inputPath)
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 90 })
  .toFile(outputPath)
  .then(info => console.log('Successfully created OG Image:', info))
  .catch(err => console.error('Error:', err));
