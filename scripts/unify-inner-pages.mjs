import fs from 'fs';

function stripInlineStyles(html) {
  return html.replace(/<style>[\s\S]*?<\/style>\s*/i, '');
}

function transformAbout(html) {
  html = stripInlineStyles(html);
  html = html.replace('<div id="about-main">', '<main class="site-page" id="about-main">');
  html = html.replace(
    /<section class="page-hero blur-in">[\s\S]*?<\/section>\s*<nav class="anchor-nav">[\s\S]*?<\/nav>\s*/,
    `<section class="page-section page-section--flush">
  <div class="page-wrap">
    <div class="sheet sheet--top">
      <div class="sheet-head">
        <h1 class="display-xl">By scientists, for <span class="accent-chip">every industry</span></h1>
        <p class="sheet-lead">The Analysis Company — bringing laboratory-grade precision wherever critical decisions are made.</p>
      </div>
      <nav class="anchor-nav" aria-label="About sections">
        <a href="#facilities">Facilities</a>
        <a href="#newsletter">Newsletter</a>
        <a href="#contact">Contact</a>
        <a href="#careers">Careers</a>
        <a href="#manufacturing">Contract Manufacturing</a>
      </nav>
    </div>
  </div>
</section>
`
  );

  html = html.replace(
    /<div class="section fade-in" id="facilities">[\s\S]*?<div class="section-eyebrow">Facilities & Equipment<\/div>\s*<h2>Where We Work<\/h2>\s*/,
    `<section class="page-section" id="facilities">
  <div class="page-wrap">
    <div class="sheet">
      <div class="sheet-head sheet-head--left">
        <span class="sheet-label">Facilities & Equipment</span>
        <h2 class="display-lg">Where We Work</h2>
      </div>
      <div class="facility-list">
`
  );

  html = html.replace(/<div class="facility-card">/g, '<div class="facility-block">');
  html = html.replace(
    /<div class="facility-header" onclick="toggleFacility\(this\)">\s*<h3>/g,
    '<button type="button" class="facility-header" onclick="toggleFacility(this)"><h3>'
  );
  html = html.replace(/<\/h3>\s*<div class="toggle">\+<\/div>\s*<\/div>/g, '</h3><span class="facility-toggle">+</span></button>');
  html = html.replace(/toggle\.textContent/g, 'toggle.textContent'); // keep
  html = html.replace(
    /toggle\.textContent = isOpen \? '\+' : '−';/,
    "toggle.textContent = isOpen ? '+' : '−';"
  );

  html = html.replace(
    /<\/div>\s*<!-- NEWSLETTER -->/,
    `      </div>
    </div>
  </div>
</section>

<!-- NEWSLETTER -->`
  );

  // Fix facilities closing - first occurrence after last facility
  html = html.replace(
    /<!-- NEWSLETTER -->\s*<div class="alt-bg">\s*<div class="section fade-in" id="newsletter">[\s\S]*?<div class="newsletter-box">[\s\S]*?<div class="section-eyebrow">Newsletter<\/div>\s*<h3>Stay in the Loop<\/h3>\s*<p>Get the latest updates[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
    `<section class="page-section" id="newsletter">
  <div class="page-wrap">
    <div class="sheet">
      <div class="sheet-head sheet-head--left">
        <span class="sheet-label">Newsletter</span>
        <h2 class="display-lg">Stay in the loop</h2>
        <p class="body-lg">Get the latest updates on TinyLab, new features, and industry insights delivered to your inbox.</p>
      </div>
      <div id="newsletterContent">
        <div class="newsletter-row">
          <input type="email" placeholder="Enter your email address" id="newsletterEmail" required>
          <button type="button" class="btn btn-primary" onclick="submitNewsletter()">Subscribe</button>
        </div>
      </div>
      <div id="newsletterSuccess" style="display:none;margin-top:1rem;">
        <p style="color:var(--neon);font-weight:700;margin:0;">You're subscribed! We'll keep you in the loop.</p>
      </div>
    </div>
  </div>
</section>`
  );

  html = html.replace(
    /<!-- CONTACT -->\s*<div class="alt-bg">\s*<div class="section fade-in" id="contact">[\s\S]*?<div class="section-eyebrow">Contact<\/div>\s*<h2>Get in Touch<\/h2>/,
    `<section class="page-section" id="contact">
  <div class="page-wrap">
    <div class="sheet">
      <div class="sheet-block sheet-block--split">
        <div class="sheet-col">
          <span class="sheet-label">Contact</span>
          <h2 class="display-lg">Get in touch</h2>`
  );

  html = html.replace(
    /<p>Have a question about TinyLab[\s\S]*?<\/p>\s*<p style="margin-top:20px">/,
    `<p class="body-lg">Have a question about TinyLab, partnerships, or anything else? We'd love to hear from you.</p>
          <p class="body-lg">`
  );
  html = html.replace(/style="color:var\(--text\)"/g, '');
  html = html.replace(/style="color:var\(--accent\);text-decoration:none"/g, 'class="link-neon"');
  html = html.replace(/<div class="form-card" id="contactFormCard">/, '<div class="form-panel" id="contactFormCard">');
  html = html.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- CAREERS -->/,
    `        </div>
      </div>
    </div>
  </div>
</section>

<!-- CAREERS -->`
  );

  html = html.replace(
    /<div class="section section-border fade-in" id="careers">[\s\S]*?<div class="section-eyebrow">Careers<\/div>\s*<h2>Join Our Team<\/h2>/,
    `<section class="page-section" id="careers">
  <div class="page-wrap">
    <div class="sheet">
      <div class="sheet-head sheet-head--left">
        <span class="sheet-label">Careers</span>
        <h2 class="display-lg">Join our team</h2>`
  );
  html = html.replace(
    /class="empty-state">No open positions[\s\S]*?<\/div>\s*<\/div>/,
    (m) => m.replace('</div>\n</div>', `</div>
    </div>
  </div>
</section>`)
  );

  html = html.replace(
    /<!-- CONTRACT MANUFACTURING -->\s*<div class="alt-bg">\s*<div class="section fade-in" id="manufacturing">[\s\S]*?<div class="section-eyebrow">Contract Manufacturing<\/div>\s*<h2>Manufacturing Inquiry<\/h2>/,
    `<section class="page-section" id="manufacturing">
  <div class="page-wrap">
    <div class="sheet">
      <div class="sheet-block sheet-block--split">
        <div class="sheet-col">
          <span class="sheet-label">Contract Manufacturing</span>
          <h2 class="display-lg">Manufacturing inquiry</h2>`
  );
  html = html.replace(/<div class="form-card" id="mfgFormCard">/, '<div class="form-panel" id="mfgFormCard">');
  html = html.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\n<article id="terms"/,
    `        </div>
      </div>
    </div>
  </div>
</section>
</main>

<article id="terms" class="legal-page site-page legal-sheet" hidden`
  );
  html = html.replace(/<article id="privacy" class="legal-page"/, '<article id="privacy" class="legal-page site-page legal-sheet"');
  html = html.replace(/<article id="terms" class="legal-page site-page legal-sheet" hidden/, '<article id="terms" class="legal-page site-page" hidden');
  html = html.replace(
    /function toggleFacility\(header\) \{\s*const body = header\.nextElementSibling;\s*const toggle = header\.querySelector\('\.toggle'\);/,
    `function toggleFacility(header) {
  const body = header.nextElementSibling;
  const toggle = header.querySelector('.facility-toggle');`
  );

  html = html.replace(/<body style="padding-top:0">/, '<body>');
  html = html.replace(/<footer class="footer">/, '<footer class="footer site-footer">');

  return html;
}

function transformPreorder(html) {
  html = stripInlineStyles(html);
  html = html.replace(/<body style="padding-top:0">/, '<body class="site-page">');
  html = html.replace(
    /<section class="page-hero blur-in">[\s\S]*?<\/section>\s*<div class="preorder-layout">/,
    `<main class="site-page-main">
<section class="page-section page-section--flush">
  <div class="page-wrap">
    <div class="sheet sheet--top">
      <div class="sheet-head">
        <span class="sheet-label">Reserve</span>
        <h1 class="display-xl">Pre-order <span class="accent-chip">TinyLab</span></h1>
        <p class="sheet-lead">Be among the first to bring portable analytical power to your facility.</p>
      </div>
    </div>
  </div>
</section>
<section class="page-section">
  <div class="page-wrap">
    <div class="sheet preorder-sheet">
`
  );
  html = html.replace(/<div class="form-card fade-in">/, '<div class="form-panel fade-in">');
  html = html.replace(/<h2>Request a Pre-Order<\/h2>/, '<h2 class="display-md">Request a pre-order</h2>');
  html = html.replace(/class="subtitle"/, 'class="body-lg"');
  html = html.replace(/class="info-side fade-in">/, 'class="sheet-col fade-in">');
  html = html.replace(/<div class="contact-box">/, '<div class="contact-inline">');
  html = html.replace(/<\/div><\/div>\s*<script>/, `    </div>
  </div>
</section>
</main>
<script>`);
  html = html.replace(/href="\.\.\/industries\/#terms"/, 'href="../about/#terms"');
  html = html.replace(/href="\.\.\/industries\/#privacy"/, 'href="../about/#privacy"');
  html = html.replace(/border-radius:50%/, 'border-radius:0');
  return html;
}

function transformIndustries(html) {
  html = stripInlineStyles(html);
  html = html.replace(/<body style="padding-top:0">/, '<body class="site-page">');

  html = html.replace(
    /<article class="ind-detail"([^>]*)>\s*<a href="\.\.\/#industries" class="back-link">← Back to home<\/a>\s*<div class="ind-hero-text">\s*<h1>([^<]*)<\/h1>\s*<div class="tags">([\s\S]*?)<\/div>\s*<\/div>\s*<div class="section">\s*<div class="section-eyebrow">([^<]*)<\/div>\s*<h2>([^<]*)<\/h2>\s*<div class="usecases-grid">/g,
    `<article class="ind-detail"$1>
<div class="page-wrap">
  <div class="sheet">
    <a href="../#industries" class="back-link">← Back to home</a>
    <div class="sheet-head sheet-head--left">
      <h1 class="display-xl">$2</h1>
      <div class="tags">$3</div>
    </div>
    <div class="sheet-block">
      <span class="sheet-label">$4</span>
      <h2 class="display-lg">$5</h2>
      <div class="usecases-grid">`
  );

  html = html.replace(
    /<\/div>\s*<\/div>\s*<section class="cta-banner">\s*<h2>([^<]*)<\/h2>\s*<p>([^<]*)<\/p>\s*<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">\s*<a href="\.\.\/preorder\/" class="btn btn-primary">([^<]*)<\/a>\s*<a href="\.\.\/#product" class="btn btn-outline" style="[^"]*">([^<]*)<\/a>\s*<\/div>\s*<\/section>\s*<\/article>/g,
    `      </div>
    </div>
    <div class="callout callout--accent ind-cta">
      <h2 class="display-lg">$1</h2>
      <p class="callout-text">$2</p>
      <div class="btn-row">
        <a href="../preorder/" class="btn btn-primary">$3</a>
        <a href="../#product" class="btn btn-ghost">$4</a>
      </div>
    </div>
  </div>
</div>
</article>`
  );

  return html;
}

// About
let about = fs.readFileSync('about/index.html', 'utf8');
about = transformAbout(about);
fs.writeFileSync('about/index.html', about);
console.log('about updated');

// Preorder
let preorder = fs.readFileSync('preorder/index.html', 'utf8');
preorder = transformPreorder(preorder);
fs.writeFileSync('preorder/index.html', preorder);
console.log('preorder updated');

// Industries
let industries = fs.readFileSync('industries/index.html', 'utf8');
industries = transformIndustries(industries);
fs.writeFileSync('industries/index.html', industries);
console.log('industries updated');
