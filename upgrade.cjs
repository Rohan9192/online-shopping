const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

// 1. Rewrite index.css
const indexCssPath = path.join(baseDir, 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

const newVars = `
  /* New Premium Colors */
  --color-black: #050505;
  --color-white: #ffffff;
  --color-off-white: #f8f8f8;
  --color-charcoal: #1c1c1c;
  --color-gray: #757575;
  --color-border: #eaeaea;
  
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-serif: 'Playfair Display', serif;
  
  --transition-smooth: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  --header-height: 80px;
`;
indexCss = indexCss.replace(/:root\s*\{[^}]+\}/s, `:root { ${newVars} }`);
fs.writeFileSync(indexCssPath, indexCss);

// 2. Add Marquee to index.css
fs.appendFileSync(indexCssPath, `
/* ========= Marquee ========= */
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
  background: var(--color-black);
  color: var(--color-white);
  padding: 12px 0;
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
}
.marquee-content {
  display: inline-block;
  animation: marquee 20s linear infinite;
}
.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`);

// 3. Rewrite Header.css for transparent-to-blur transition
const headerCssPath = path.join(baseDir, 'components', 'Header', 'Header.css');
let headerCss = fs.readFileSync(headerCssPath, 'utf8');
headerCss = headerCss.replace(
  /\.header\s*\{[^}]+\}/,
  `.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: transparent;
  color: var(--color-white);
  transition: all var(--transition-smooth);
}`
);
headerCss = headerCss.replace(
  /\.header--scrolled\s*\{[^}]+\}/,
  `.header--scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  color: var(--color-black);
  box-shadow: 0 1px 0 rgba(0,0,0,0.05);
}`
);
headerCss += `
.header__logo .logo-text { color: inherit; }
.header__nav-link { color: inherit; opacity: 0.8; }
.header__nav-link:hover, .header__nav-link.active { color: inherit; opacity: 1; }
.header__icon-btn { color: inherit; }
.header__icon-btn:hover { background: rgba(128,128,128,0.1); }
`;
fs.writeFileSync(headerCssPath, headerCss);

console.log("Updated styles successfully!");
