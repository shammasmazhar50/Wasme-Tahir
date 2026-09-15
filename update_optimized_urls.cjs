const fs = require('fs');
const path = require('path');

const walk = function(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
const optimized = [
  'IMG_1179', 'IMG_1383', 'IMG_4347', 'IMG_4542', 
  'IMG_4981', 'IMG_6535', 'IMG_7665', 'IMG_8144', 'IMG_8380'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  optimized.forEach(img => {
    const target = `${img}.webp`;
    const replacement = `${img}-opt.webp`;
    if (content.includes(target)) {
      content = content.replace(new RegExp(target, 'g'), replacement);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
