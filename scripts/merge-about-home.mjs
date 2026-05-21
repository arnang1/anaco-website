import fs from 'fs';

const about = fs.readFileSync('about/index.html', 'utf8');
let index = fs.readFileSync('index.html', 'utf8');

const facilityMatch = about.match(/<div class="facility-list">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/section>\s*<section class="page-section" id="newsletter">/);
if (!facilityMatch) throw new Error('facility-list not found');
const facilityInner = facilityMatch[1].trim();

const aboutSections = `
<section class="home-section" id="about">
  <div class="home-wrap">
    <div class="sheet">
      <div class="sheet-head">
        <span class="sheet-label">About</span>
        <h2 class="display-lg">By scientists, for <span class="accent-chip">every industry</span></h2>
        <p class="sheet-lead">The Analysis Company — bringing laboratory-grade precision wherever critical decisions are made.</p>
      </div>
    </div>
  </div>
</section>

<section class="home-section" id="facilities">
  <div class="home-wrap">
    <div class="sheet">
      <div class="sheet-head sheet-head--left">
        <span class="sheet-label">Facilities & Equipment</span>
        <h2 class="display-lg">Where we work</h2>
      </div>
      <div class="facility-list">
${facilityInner}
      </div>
      <div class="sheet-foot pattern-hatch" aria-hidden="true"></div>
    </div>
  </div>
</section>

<section class="home-section" id="newsletter">
  <div class="home-wrap">
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
      <div id="newsletterSuccess" class="newsletter-success" hidden>
        <p>You're subscribed! We'll keep you in the loop.</p>
      </div>
    </div>
  </div>
</section>

<section class="home-section" id="careers">
  <div class="home-wrap">
    <div class="sheet">
      <div class="sheet-head sheet-head--left">
        <span class="sheet-label">Careers</span>
        <h2 class="display-lg">Join our team</h2>
        <p class="body-lg">No open positions at this time. Interested in working with us? Use the form below and select <strong>Hiring / Careers</strong>.</p>
      </div>
    </div>
  </div>
</section>

<section class="home-section" id="contact">
  <div class="home-wrap">
    <div class="sheet sheet--stacked">
      <div class="sheet-block">
        <div class="sheet-head sheet-head--left">
          <span class="sheet-label">Get in touch</span>
          <h2 class="display-lg">General, hiring, or manufacturing</h2>
          <p class="body-lg">One form for product questions, careers, contract manufacturing, and everything else. We'll route your message to the right team.</p>
          <p class="body-lg"><strong>Email:</strong> <a href="mailto:bliker@anaco.com" class="link-neon">bliker@anaco.com</a></p>
        </div>
      </div>
      <div class="sheet-block">
        <div class="form-panel" id="inquiryFormCard">
          <div id="inquiryFormContent">
            <div class="form-row">
              <div class="form-group">
                <label for="inquiryName">Name *</label>
                <input type="text" id="inquiryName" placeholder="Your name" required>
              </div>
              <div class="form-group">
                <label for="inquiryEmail">Email *</label>
                <input type="email" id="inquiryEmail" placeholder="you@company.com" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="inquiryCompany">Company</label>
                <input type="text" id="inquiryCompany" placeholder="Company name">
              </div>
              <div class="form-group">
                <label for="inquiryPhone">Phone</label>
                <input type="tel" id="inquiryPhone" placeholder="(555) 000-0000">
              </div>
            </div>
            <div class="form-group">
              <label for="inquiryType">Inquiry type *</label>
              <select id="inquiryType" required>
                <option value="" disabled selected>Select a topic</option>
                <option>General inquiry</option>
                <option>TinyLab / Product</option>
                <option>Hiring / Careers</option>
                <option>Contract manufacturing</option>
                <option>Partnership</option>
              </select>
            </div>
            <div class="form-group">
              <label for="inquiryMessage">Message *</label>
              <textarea id="inquiryMessage" placeholder="How can we help?" required></textarea>
            </div>
            <button type="button" class="submit-btn" onclick="submitInquiry()">Send message →</button>
          </div>
          <div id="inquirySuccess" class="form-success">
            <div class="check">
              <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="var(--accent)" stroke-width="3"><path d="M6 16l7 7L26 9"/></svg>
            </div>
            <h3 class="display-md">Message sent</h3>
            <p class="body-lg">Thank you for reaching out. We'll get back to you shortly.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="home-section legal-page" id="terms" data-title="Terms of Service" hidden>
  <div class="home-wrap">
    <div class="sheet legal-sheet">
      <a href="./" class="back-link">← Home</a>
      <h1 class="display-lg">Terms of Service</h1>
      <p class="body-lg">Coming soon.</p>
    </div>
  </div>
</section>

<section class="home-section legal-page" id="privacy" data-title="Privacy Policy" hidden>
  <div class="home-wrap">
    <div class="sheet legal-sheet">
      <a href="./" class="back-link">← Home</a>
      <h1 class="display-lg">Privacy Policy</h1>
      <p class="body-lg">Coming soon.</p>
    </div>
  </div>
</section>
`;

index = index.replace(
  /<section class="home-section home-section--cta" id="pricing">[\s\S]*?<\/section>\s*\n<\/main>/,
  `<section class="home-section home-section--cta" id="pricing">
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
${aboutSections}
</main>`
);

index = index.replace(
  /<ul class="nav-links">\s*<li><a href="about\/">About<\/a><\/li>\s*/,
  '<ul class="nav-links">\n      '
);
index = index.replace(
  /about\/#terms/g,
  '#terms'
).replace(
  /about\/#privacy/g,
  '#privacy'
);

const homeScripts = `
function toggleFacility(header) {
  var body = header.nextElementSibling;
  var toggle = header.querySelector('.facility-toggle');
  var isOpen = body.classList.contains('open');
  body.classList.toggle('open');
  toggle.textContent = isOpen ? '+' : '−';
}
function submitNewsletter() {
  var email = document.getElementById('newsletterEmail');
  if (!email.value) { alert('Please enter your email address.'); return; }
  var data = new FormData();
  data.append('email', email.value);
  data.append('_subject', 'Newsletter Subscription — ' + email.value);
  data.append('_template', 'table');
  fetch('https://formsubmit.co/ajax/agangla@anaco.com', { method: 'POST', body: data })
    .then(function () { showNewsletterSuccess(); })
    .catch(function () { showNewsletterSuccess(); });
}
function showNewsletterSuccess() {
  document.getElementById('newsletterContent').hidden = true;
  document.getElementById('newsletterSuccess').hidden = false;
}
function submitInquiry() {
  var name = document.getElementById('inquiryName');
  var email = document.getElementById('inquiryEmail');
  var type = document.getElementById('inquiryType');
  var message = document.getElementById('inquiryMessage');
  if (!name.value || !email.value || !type.value || !message.value) {
    alert('Please fill in all required fields.');
    return;
  }
  var company = document.getElementById('inquiryCompany').value;
  var phone = document.getElementById('inquiryPhone').value;
  var data = new FormData();
  data.append('name', name.value);
  data.append('email', email.value);
  data.append('inquiry_type', type.value);
  data.append('message', message.value);
  data.append('_subject', type.value + ' — ' + name.value);
  data.append('_template', 'table');
  if (company) data.append('company', company);
  if (phone) data.append('phone', phone);
  fetch('https://formsubmit.co/ajax/agangla@anaco.com', { method: 'POST', body: data })
    .then(function () { showInquirySuccess(); })
    .catch(function () { showInquirySuccess(); });
}
function showInquirySuccess() {
  document.getElementById('inquiryFormContent').style.display = 'none';
  document.getElementById('inquirySuccess').classList.add('show');
}
function showLegalView() {
  var hash = (location.hash || '').slice(1);
  var main = document.querySelector('main.home');
  var legalPages = document.querySelectorAll('section.legal-page');
  var legal = (hash === 'terms' || hash === 'privacy') ? document.getElementById(hash) : null;
  if (legal) {
    main.hidden = true;
    legalPages.forEach(function (p) { p.hidden = p !== legal; });
    document.title = legal.dataset.title + ' — Anaco';
    window.scrollTo(0, 0);
  } else {
    main.hidden = false;
    legalPages.forEach(function (p) { p.hidden = true; });
    document.title = 'Anaco — The Analysis Company';
  }
}
window.addEventListener('hashchange', showLegalView);
showLegalView();
`;

index = index.replace(
  /document\.getElementById\('ceoModal'\)\.addEventListener/,
  homeScripts + "\ndocument.getElementById('ceoModal').addEventListener"
);

fs.writeFileSync('index.html', index);

// about redirect
fs.writeFileSync('about/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=../#about">
<script>location.replace('../#about');</script>
<title>About — Anaco</title>
<link rel="canonical" href="../#about">
</head>
<body>
<p><a href="../#about">Continue to About on the home page</a></p>
</body>
</html>
`);

// terms/privacy redirects
for (const page of ['terms', 'privacy']) {
  fs.writeFileSync(`${page}/index.html`, `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=../#${page}">
<script>location.replace('../#${page}');</script>
<title>${page === 'terms' ? 'Terms' : 'Privacy'} — Anaco</title>
</head>
<body><p><a href="../#${page}">Continue on the home page</a></p></body>
</html>
`);
}

console.log('merged about into index.html');
