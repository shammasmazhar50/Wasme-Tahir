const sharp = require('sharp');
const path = require('path');

(async () => {
  const inputPath = 'D:/Projects/Wasme Tahir/Collab/IMG_6904.DNG';
  const outputPath = 'D:/Projects/Wasme Tahir/public/images/IMG_6904.webp';

  try {
    console.log(`Processing DNG file: ${inputPath}...`);
    await sharp(inputPath)
      .resize(1600, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`Successfully converted to WebP: ${outputPath}`);
  } catch(e) {
    console.error('Error converting DNG:', e);
  }
})();
