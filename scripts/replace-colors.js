const fs = require('fs');
const path = require('path');

const directories = [
  'components/layout',
  'components/ui',
  'app'
];

function processFile(filePath) {
  if (filePath.endsWith('HeroSection.tsx')) {
    // HeroSection should remain dark, only replace primary colors
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/#4CAF50/g, 'var(--primary)');
    // actually, tailwind classes: text-[#4CAF50] -> text-primary, bg-[#4CAF50] -> bg-primary
    content = content.replace(/text-\[\#4CAF50\]/g, 'text-primary');
    content = content.replace(/bg-\[\#4CAF50\]/g, 'bg-primary');
    content = content.replace(/border-\[\#4CAF50\]/g, 'border-primary');
    content = content.replace(/shadow-\[\#4CAF50\]/g, 'shadow-primary');
    content = content.replace(/fill-\[\#4CAF50\]/g, 'fill-primary');
    fs.writeFileSync(filePath, content);
    console.log('Processed', filePath);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Backgrounds
  content = content.replace(/bg-\[\#121212\]/g, 'bg-background');
  content = content.replace(/bg-\[\#0a180d\]/g, 'bg-card');
  content = content.replace(/bg-\[\#0d160f\]/g, 'bg-card');
  content = content.replace(/bg-\[\#0d1f0f\]/g, 'bg-primary-foreground');
  content = content.replace(/bg-\[\#080808\]/g, 'bg-background');
  content = content.replace(/bg-\[\#1a1a1a\]/g, 'bg-card');

  // Text
  content = content.replace(/text-\[\#4CAF50\]/g, 'text-primary');
  content = content.replace(/text-\[\#0d1f0f\]/g, 'text-primary-foreground');
  
  // Actually text-white -> text-foreground in dark sections
  // This is tricky via regex because text-white is also used in buttons.
  // We'll replace specific text-white that are headings or paragraphs if possible, or just leave text-white and rely on bg-background being dark in dark mode, but in light mode text-white would be invisible!
  
  // Primary
  content = content.replace(/bg-\[\#4CAF50\]/g, 'bg-primary');
  content = content.replace(/border-\[\#4CAF50\]/g, 'border-primary');
  content = content.replace(/shadow-\[\#4CAF50\]/g, 'shadow-primary');
  content = content.replace(/fill-\[\#4CAF50\]/g, 'fill-primary');

  // Borders
  content = content.replace(/border-white\/10/g, 'border-border');
  content = content.replace(/border-white\/5/g, 'border-border');

  fs.writeFileSync(filePath, content);
  console.log('Processed', filePath);
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
