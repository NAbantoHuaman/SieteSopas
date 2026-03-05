const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/orange-([0-9]{2,3})/g, 'red-$1')
      .replace(/amber-([0-9]{2,3})/g, 'red-$1')
      .replace(/emerald-([0-9]{2,3})/g, 'green-$1');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated colors in ${filePath}`);
    }
  }
});
