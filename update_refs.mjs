import fs from 'fs';
import path from 'path';

const pagesDir = 'D:/Projects/Wasme Tahir/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace .jpg and .PNG with .webp for everything in /images/
  // But wait, the previous webp might already be there (e.g. IMG_1179.webp).
  // We just need to replace \.(jpg|png|PNG|JPEG|jpeg) with .webp
  const updatedContent = content.replace(/\/images\/([^"'\s]+)\.(jpg|png|PNG|JPEG|jpeg)/g, '/images/$1.webp');
  
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${file}`);
  }
}
