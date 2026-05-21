import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.join('industries', 'index.html'), 'utf8');
const order = [
  'winemaking', 'biomanufacturing', 'agriculture', 'chemicals', 'oil-gas', 'research',
  'defense', 'municipal', 'k12-education', 'university-education', 'beverages',
  'cpg-food', 'nutrition-supplements', 'beauty-fragrance', 'home',
];
const cards = {
  winemaking: { title: 'Wine & Beer', img: 'images/winery.jpg' },
  biomanufacturing: { title: 'Biomanufacturing', img: 'images/biomanufacturing.jpg' },
  agriculture: { title: 'Agriculture', img: 'images/agriculture.jpg' },
  chemicals: { title: 'Chemicals', img: 'images/chemicals.jpg' },
  'oil-gas': { title: 'Oil & Gas', img: 'images/oilandgas.jpg' },
  research: { title: 'Research', img: 'images/research.jpg' },
  defense: { title: 'Defense', img: 'images/defense.jpg' },
  municipal: { title: 'Municipal', img: 'images/municipal.jpg' },
  'k12-education': { title: 'K–12 Education', img: 'images/education.jpg' },
  'university-education': { title: 'University Education', img: 'images/universityeducation.jpg' },
  beverages: { title: 'Beverages', img: 'images/beverages.jpg' },
  'cpg-food': { title: 'CPG Food', img: 'images/cpg.jpg' },
  'nutrition-supplements': { title: 'Nutrition & Supplements', img: 'images/supplementsnutrition.jpg' },
  'beauty-fragrance': { title: 'Beauty & Fragrances', img: 'images/beautyfragrances.jpg' },
  home: { title: 'For Home', img: 'images/home.jpg' },
};

const articles = [...html.matchAll(/<article class="ind-detail" id="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
const out = [];

for (const id of order) {
  const art = articles.find((a) => a[1] === id);
  if (!art) throw new Error(`Missing article: ${id}`);
  const block = art[2];
  const heading = (block.match(/<h2 class="display-lg">([^<]+)<\/h2>/) || [])[1];
  const cases = [
    ...block.matchAll(
      /<div class="usecase-card[^"]*">[\s\S]*?<div class="usecase-icon">([\s\S]*?)<\/div>[\s\S]*?<div class="usecase-label">([^<]*)<\/div>[\s\S]*?<h3>([^<]*)<\/h3>[\s\S]*?<p>([^<]*)<\/p>/g
    ),
  ].map((m) => ({
    icon: m[1].trim(),
    label: m[2].trim(),
    head: m[3].trim(),
    text: m[4].trim(),
  }));
  out.push({ id, title: cards[id].title, img: cards[id].img, heading, cases });
}

const js = 'window.INDUSTRIES_DATA=' + JSON.stringify(out) + ';\n';
fs.writeFileSync(path.join('js', 'industries-data.js'), js, 'utf8');
console.log('Wrote js/industries-data.js (' + out.length + ' industries)');
