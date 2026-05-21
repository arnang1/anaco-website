import fs from 'fs';
const c = fs.readFileSync('tinylab/index.html', 'utf8');
const m = c.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!m) throw new Error('module script not found');
const s = m[1].replace(/\.\.\/images\//g, 'images/');
fs.writeFileSync('js/tinylab-viewer.js', s);
console.log('wrote', s.length, 'bytes');
