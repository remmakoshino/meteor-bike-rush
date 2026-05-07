import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

function mustExist(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

[
  'src/scenes/RaceScene.ts',
  'src/systems/RaceSystem.ts',
  'src/systems/PositionSystem.ts',
  'src/systems/LapSystem.ts',
  'src/types/index.ts',
  'src/styles/global.css',
  '.github/workflows/deploy.yml',
  'SPEC.md'
].forEach(mustExist);

const tsconfigPath = path.join(root, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = fs.readFileSync(tsconfigPath, 'utf8');
  if (!tsconfig.includes('"strict": true')) {
    errors.push('tsconfig strict mode is not enabled');
  }
} else {
  errors.push('tsconfig.json is missing');
}

const raceSystemPath = path.join(root, 'src/systems/RaceSystem.ts');
if (fs.existsSync(raceSystemPath)) {
  const content = fs.readFileSync(raceSystemPath, 'utf8');
  const expectedOrder = ['capturePlayerInput', 'updateAi', 'updatePhysics', 'updateCollisions', 'updateItems', 'updatePositions', 'updateUi'];
  let last = -1;
  for (const token of expectedOrder) {
    const idx = content.indexOf(token);
    if (idx === -1) {
      errors.push(`RaceSystem update order token missing: ${token}`);
      break;
    }
    if (idx < last) {
      errors.push(`RaceSystem update order is incorrect around: ${token}`);
      break;
    }
    last = idx;
  }
}

const cssPath = path.join(root, 'src/styles/global.css');
if (fs.existsSync(cssPath)) {
  const content = fs.readFileSync(cssPath, 'utf8');
  const requiredCss = ['overflow: hidden', 'safe-area-inset-top', 'safe-area-inset-bottom', 'height: 100dvh'];
  requiredCss.forEach((token) => {
    if (!content.includes(token)) {
      errors.push(`global.css missing responsive safety rule: ${token}`);
    }
  });
}

const deployPath = path.join(root, '.github/workflows/deploy.yml');
if (fs.existsSync(deployPath)) {
  const content = fs.readFileSync(deployPath, 'utf8');
  if (!content.includes('branches: [main, master]')) {
    errors.push('deploy workflow is not configured for main/master branches');
  }
  ['typecheck', 'test:unit', 'test:e2e', 'debug:static'].forEach((cmd) => {
    if (!content.includes(cmd)) {
      errors.push(`deploy workflow does not run: ${cmd}`);
    }
  });
}

if (errors.length > 0) {
  console.error('Static debug checks failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Static debug checks passed.');
