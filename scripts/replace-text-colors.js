const fs = require('fs');
const path = require('path');

const directories = [
  'components/layout',
  'components/ui',
  'app'
];

function processFile(filePath) {
  if (filePath.endsWith('HeroSection.tsx') || filePath.endsWith('CallToActionSection.tsx')) {
    return; // skip these to retain hardcoded contrasting colors over images/solid backgrounds
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Text
  content = content.replace(/text-white/g, 'text-foreground');
  content = content.replace(/text-zinc-400/g, 'text-muted-foreground');
  content = content.replace(/text-zinc-300/g, 'text-muted-foreground');
  content = content.replace(/text-zinc-500/g, 'text-muted-foreground');

  // Borders
  content = content.replace(/border-white\/20/g, 'border-border');
  content = content.replace(/border-white\/10/g, 'border-border');
  content = content.replace(/border-white\/15/g, 'border-border');
  content = content.replace(/border-white\/5/g, 'border-border');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Processed Text/Borders for', filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

directories.forEach(d => {
  const full = path.join(process.cwd(), d);
  if (fs.existsSync(full)) traverseDir(full);
});
