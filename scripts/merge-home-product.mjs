import fs from 'fs';

const tinylab = fs.readFileSync('tinylab/index.html', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

const specsMatch = tinylab.match(/<div class="specs-grid">[\s\S]*?<\/div>\s*\n<\/div>\s*\n<section class="cta-strip/);
if (!specsMatch) throw new Error('specs-grid not found');
const specsGrid = specsMatch[0].replace(/\n<section class="cta-strip$/, '').trim();

const productSection = `
<section class="home-section" id="product">
  <div class="home-wrap">
    <div class="sheet sheet--stacked">
      <div class="sheet-block">
        <div class="sheet-head">
          <span class="sheet-label">Interactive</span>
          <h2 class="display-lg">Explore TinyLab in 3D</h2>
          <p class="sheet-lead">Hover to highlight a module. Click to zoom in.</p>
        </div>
        <div id="viewer-container" class="viewer-frame">
          <canvas id="viewer-canvas"></canvas>
          <div id="part-hud" class="viewer-hud" style="display:none">
            <div class="viewer-hud-label">Module</div>
            <div id="part-name" class="viewer-hud-title"></div>
          </div>
          <button type="button" id="backBtn" class="viewer-btn viewer-btn--tl" onclick="exitModule()" style="display:none">← Back to Overview</button>
          <div id="moduleTitle" class="viewer-module-title" style="display:none"></div>
          <div class="viewer-controls viewer-controls--tr">
            <button type="button" class="viewer-btn" onclick="resetView()">Reset View</button>
          </div>
          <div class="viewer-controls viewer-controls--br">
            <button type="button" class="viewer-btn viewer-btn--round" onclick="zoomIn()" aria-label="Zoom in">+</button>
            <button type="button" class="viewer-btn viewer-btn--round" onclick="zoomOut()" aria-label="Zoom out">−</button>
          </div>
          <div id="viewer-placeholder" class="viewer-placeholder">
            <span>3D model loading…</span>
          </div>
        </div>
      </div>
      <div class="sheet-band pattern-hatch" aria-hidden="true"></div>
      <div class="sheet-block">
        <div class="sheet-head sheet-head--left">
          <span class="sheet-label">Specifications</span>
          <h2 class="display-lg">What's inside TinyLab</h2>
        </div>
        ${specsGrid}
      </div>
    </div>
  </div>
</section>
`;

const ctaSection = `
<section class="home-section home-section--cta" id="pricing">
  <div class="home-wrap">
    <div class="callout callout--accent callout--pricing">
      <span class="sheet-label">Pricing</span>
      <h2 class="display-lg">Laboratory-grade analysis, accessible pricing</h2>
      <p class="callout-price">$599 <span>/ month</span></p>
      <p class="callout-text">Everything you need to run your lab. Module upgrades available.</p>
      <p class="deposit-note">Guarantee a spot in our production run with a <strong>$499 deposit</strong></p>
      <a href="preorder/" class="btn btn-primary btn-lg">Pre-Order Now →</a>
    </div>
  </div>
</section>
`;

const fixed = index.replace(
  /<section class="home-section home-section--cta">[\s\S]*?<\/section>\s*\n\s*<\/main>/,
  productSection + '\n' + ctaSection + '\n</main>'
);

const scripts = `
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>
<script type="module" src="js/tinylab-viewer.js"></script>
`;

const withViewer = fixed.replace(
  '<script src="js/anaco.js" defer></script>',
  scripts + '<script src="js/anaco.js" defer></script>'
);

fs.writeFileSync('index.html', withViewer);
console.log('updated index.html');
