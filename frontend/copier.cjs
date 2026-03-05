const fs = require('fs');
const path = require('path');
const src = 'c:\\Users\\USER\\Downloads\\EFSRT\\7 sopas';
const dest = 'c:\\Users\\USER\\Downloads\\EFSRT\\frontend\\public\\images\\siete_sopas';

if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
}

fs.readdirSync(src).forEach(file => {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
});
console.log('Copied successfully!');
