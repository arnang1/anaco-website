/**
 * Generates web-optimized assets for the home page carousel and hero.
 * Run: node scripts/optimize-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Install sharp first: npm install --save-dev sharp');
  process.exit(1);
}

const carouselNames = [
  'winery',
  'biomanufacturing',
  'agriculture',
  'chemicals',
  'oilandgas',
  'research',
  'defense',
  'municipal',
  'education',
  'universityeducation',
  'beverages',
  'cpg',
  'supplementsnutrition',
  'beautyfragrances',
  'home',
];

const carouselDir = path.join(imagesDir, 'carousel');
const heroDir = path.join(imagesDir, 'hero');
fs.mkdirSync(carouselDir, { recursive: true });
fs.mkdirSync(heroDir, { recursive: true });

async function writeWebp(inputPath, outputPath, width, quality = 78) {
  if (!fs.existsSync(inputPath)) {
    console.warn('skip (missing):', inputPath);
    return;
  }
  await sharp(inputPath)
    .rotate()
    .resize({ width: Math.round(width), withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(outputPath);
  const kb = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log('wrote', path.relative(root, outputPath), `${kb} KB`);
}

for (const name of carouselNames) {
  const src = path.join(imagesDir, `${name}.jpg`);
  const altSrc = path.join(imagesDir, name === 'winery' ? 'winery.jpg' : `${name}.jpg`);
  const input = fs.existsSync(src) ? src : altSrc;
  await writeWebp(input, path.join(carouselDir, `${name}.webp`), 420);
}

const gifPath = path.join(imagesDir, 'tinylab-device.gif');
if (fs.existsSync(gifPath)) {
  await sharp(gifPath, { animated: false })
    .resize({ width: 912, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(heroDir, 'tinylab-device.webp'));
  console.log('wrote hero poster webp');
}

console.log('Done.');
