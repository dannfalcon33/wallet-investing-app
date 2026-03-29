const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = {
  'sol-gradient': 'gold-gradient',
  'sol-green': 'gold-primary',
  'sol-purple': 'gold-secondary',
  'text-green': 'text-gold-primary',
  'text-purple': 'text-gold-secondary',
  '--success: #14F195;': '--success: var(--gold-primary);',
};

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    for (const [key, value] of Object.entries(replacements)) {
      if (content.includes(key)) {
        content = content.replace(new RegExp(key, 'g'), value);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
