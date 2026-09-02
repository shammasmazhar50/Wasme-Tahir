const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'src', 'content', 'blogs');
const outputFile = path.join(__dirname, 'src', 'content', 'blog-index.json');

// Ensure the blogs directory exists
if (!fs.existsSync(blogsDir)) {
  console.log("No blogs directory found.");
  fs.writeFileSync(outputFile, JSON.stringify([]));
  process.exit(0);
}

const files = fs.readdirSync(blogsDir);
const index = [];

files.forEach(file => {
  if (file.endsWith('.md')) {
    const rawText = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = rawText.match(frontmatterRegex);
    
    if (match) {
      const frontmatter = {};
      match[1].split(/\r?\n/).forEach(line => {
        const splitIndex = line.indexOf(':');
        if (splitIndex !== -1) {
          const key = line.slice(0, splitIndex).trim();
          let value = line.slice(splitIndex + 1).trim();
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          frontmatter[key] = value;
        }
      });
      
      index.push({
        ...frontmatter,
        fileSlug: file.replace('.md', '')
      });
    }
  }
});

// Sort by date descending
index.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));
console.log(`Generated blog index with ${index.length} entries.`);
