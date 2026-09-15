const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public/images');
const outputDir = path.join(__dirname, 'public/opt-img');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  try {
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.webp') && !f.includes('-opt'));
    let optimizedCount = 0;

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      const metadata = await sharp(inputPath).metadata();
      
      // Process all images to ensure they are web-ready
      await sharp(inputPath)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 75, effort: 6 }) 
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size / 1024;
      const newSize = fs.statSync(outputPath).size / 1024;
      
      console.log(`Optimized ${file}: ${originalSize.toFixed(1)}KB -> ${newSize.toFixed(1)}KB`);
      optimizedCount++;
    }
    
    console.log(`\nSuccessfully optimized ${optimizedCount} images to /opt-img/`);
  } catch (err) {
    console.error('Error optimizing images:', err);
  }
})();
