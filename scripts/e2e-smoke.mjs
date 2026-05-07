import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distPath = path.join(root, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(distPath)) {
  console.error('dist directory is missing. Run build before e2e smoke test.');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html is missing.');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('game-container')) {
  console.error('Smoke check failed: game container is missing in dist/index.html');
  process.exit(1);
}

const assetsDir = path.join(distPath, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.error('Smoke check failed: dist/assets directory is missing.');
  process.exit(1);
}

const assetFiles = fs.readdirSync(assetsDir);
if (!assetFiles.some((file) => file.endsWith('.js'))) {
  console.error('Smoke check failed: no JS asset found in dist/assets.');
  process.exit(1);
}

console.log('E2E smoke checks passed.');
