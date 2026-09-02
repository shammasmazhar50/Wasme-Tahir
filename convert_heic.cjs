const fs = require('fs');
const convert = require('heic-convert');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: node convert_heic.cjs <absolute_path_to.HEIC>');
    process.exit(1);
  }

  const inputPath = args[0];
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outputPath = `D:/Projects/Wasme Tahir/public/images/${baseName}.jpg`;

  try {
    console.log(`Reading HEIC file: ${inputPath}...`);
    const inputBuffer = fs.readFileSync(inputPath);
    console.log('Converting HEIC to JPEG...');
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1
    });
    console.log(`Writing JPEG file: ${outputPath}...`);
    fs.writeFileSync(outputPath, outputBuffer);
    console.log(`Successfully converted to JPG`);
  } catch(e) {
    console.error('Error converting HEIC:', e);
  }
})();
