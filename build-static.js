const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

// Copy root index.html
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(dist, 'index.html'));

// Copy google-auth.html if present
if (fs.existsSync(path.join(__dirname, 'google-auth.html'))) {
  fs.copyFileSync(path.join(__dirname, 'google-auth.html'), path.join(dist, 'google-auth.html'));
}

// Copy assets folder
const srcAssets = path.join(__dirname, 'assets');
const distAssets = path.join(dist, 'assets');
if (fs.existsSync(srcAssets)) {
  if (!fs.existsSync(distAssets)) {
    fs.mkdirSync(distAssets, { recursive: true });
  }
  const files = fs.readdirSync(srcAssets);
  for (const file of files) {
    fs.copyFileSync(path.join(srcAssets, file), path.join(distAssets, file));
  }
}

console.log('✅ Static build complete! Root index.html and assets copied to dist/');
