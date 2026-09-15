const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/images');

(async () => {
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
    let resizedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const metadata = await sharp(filePath).metadata();
      
      // If width is > 1600 or file is > 600KB, resize it
      if (metadata.width > 1600 || stat.size > 600000) {
        console.log(`Processing ${file}... (Width: ${metadata.width}, Size: ${(stat.size/1024/1024).toFixed(2)} MB)`);
        
        const tempPath = filePath + '.tmp';
        await sharp(filePath)
          .resize(1600, null, { withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(tempPath);
        
        try {
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);
          console.log(` -> Optimized ${file} (New Size: ${(fs.statSync(filePath).size/1024).toFixed(2)} KB)`);
          resizedCount++;
        } catch (renameErr) {
          console.log(` -> Failed to replace ${file} (file might be locked by Vite/browser). Saving as ${file.replace('.webp', '-opt.webp')}`);
          fs.renameSync(tempPath, filePath.replace('.webp', '-opt.webp'));
        }
      }
    }
    console.log(`\nFinished! Optimized ${resizedCount} images.`);
  } catch (error) {
    console.error('Error during image optimization:', error);
  }
})();
