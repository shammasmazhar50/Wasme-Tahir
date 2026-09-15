const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, filePath => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes("import.meta.env.VITE_API_URL || 'http://localhost:3001'")) {
      content = content.replace(
        /import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:3001'/g,
        "import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:6002' : 'https://api.wasmetahir.com')"
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
