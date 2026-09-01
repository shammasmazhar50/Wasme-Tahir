import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'D:/Projects/Wasme Tahir/public/images';

const optimizeImages = async () => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Only target jpg and png files
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const filePath = path.join(dir, file);
      const nameWithoutExt = path.basename(file, path.extname(file));
      const outPath = path.join(dir, `${nameWithoutExt}.webp`);

      // Skip if we already have a webp version, unless we are converting it again
      console.log(`Processing ${file}...`);
      
      try {
        await sharp(filePath)
          .resize(1600, null, { withoutEnlargement: true }) // Scale down to max 1600 width
          .webp({ quality: 80 })
          .toFile(outPath);
          
        console.log(`Successfully compressed to ${outPath}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
};

optimizeImages();
