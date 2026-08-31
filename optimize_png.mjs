import fs from 'fs';
import sharp from 'sharp';

const run = async () => {
  try {
    console.log('Optimizing PNGs to WebP...');
    
    await sharp('public/images/6FD2F68C-F3B3-4C5B-9C8C-3D5D4DED991B.png')
      .resize({ width: 1200 })
      .webp({ quality: 80 })
      .toFile('public/images/sig1.webp');
      
    await sharp('public/images/F52BD86E-764E-4BBB-96FE-F652F49FCBD5.png')
      .resize({ width: 1200 })
      .webp({ quality: 80 })
      .toFile('public/images/sig2.webp');
      
    console.log('Optimization complete!');
  } catch (error) {
    console.error('Error:', error);
  }
};

run();
