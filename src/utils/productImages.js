/**
 * Generates a product placeholder image as a data URI SVG.
 * Each product type gets a distinct illustration style.
 */

const tshirtColors = {
  'Classic Black T-Shirt': { bg: '#1a1a1a', shirt: '#0a0a0a', accent: '#333' },
  'Premium White T-Shirt': { bg: '#e8e4df', shirt: '#ffffff', accent: '#f0ece7' },
  'Oversized Beige T-Shirt': { bg: '#c9b896', shirt: '#d4b896', accent: '#e0cdb3' },
  'Graphic Black T-Shirt': { bg: '#1a1a1a', shirt: '#111', accent: '#c17f59' },
  'Classic Navy T-Shirt': { bg: '#1b2a4a', shirt: '#152040', accent: '#2a3f6a' },
  'Premium Gray T-Shirt': { bg: '#6b6b6b', shirt: '#808080', accent: '#9e9e9e' },
};

const jeansColors = {
  'Classic Blue Jeans': { bg: '#3d5a80', jeans: '#2c4a70', accent: '#4a7ab5' },
  'Dark Blue Denim': { bg: '#1a237e', jeans: '#111a5c', accent: '#283593' },
  'Black Slim Jeans': { bg: '#1a1a1a', jeans: '#0a0a0a', accent: '#2d2d2d' },
  'Relaxed Fit Jeans': { bg: '#5c85b3', jeans: '#4a73a1', accent: '#7a9fc5' },
  'Light Wash Jeans': { bg: '#8bb0d0', jeans: '#7aa0c0', accent: '#a5c5e0' },
  'Straight Fit Denim': { bg: '#2c3e6b', jeans: '#1f305a', accent: '#4a6fa5' },
};

function createTShirtSVG(name) {
  const c = tshirtColors[name] || { bg: '#333', shirt: '#222', accent: '#555' };
  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="${c.bg}"/>
  <rect x="0" y="0" width="400" height="500" fill="${c.bg}" opacity="0.9"/>
  <!-- T-Shirt Shape -->
  <path d="M120,140 L100,160 L60,145 L50,200 L100,210 L100,360 L300,360 L300,210 L350,200 L340,145 L300,160 L280,140 
    C270,120 240,110 200,110 C160,110 130,120 120,140 Z" 
    fill="${c.shirt}" stroke="${c.accent}" stroke-width="1.5"/>
  <!-- Collar -->
  <ellipse cx="200" cy="130" rx="40" ry="20" fill="${c.bg}" stroke="${c.accent}" stroke-width="1"/>
  <!-- Sleeve Lines -->
  <line x1="100" y1="165" x2="100" y2="210" stroke="${c.accent}" stroke-width="0.8" opacity="0.5"/>
  <line x1="300" y1="165" x2="300" y2="210" stroke="${c.accent}" stroke-width="0.8" opacity="0.5"/>
  ${name.includes('Graphic') ? `
  <circle cx="200" cy="260" r="35" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.7"/>
  <line x1="175" y1="235" x2="225" y2="285" stroke="${c.accent}" stroke-width="1.5" opacity="0.5"/>
  ` : ''}
  <!-- Brand -->
  <text x="200" y="430" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="300" letter-spacing="3" fill="rgba(255,255,255,0.6)">STYLEHUB</text>
</svg>`)}`;
}

function createJeansSVG(name) {
  const c = jeansColors[name] || { bg: '#3d5a80', jeans: '#2c4a70', accent: '#4a7ab5' };
  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="${c.bg}"/>
  <!-- Jeans Shape -->
  <path d="M130,80 L110,80 L100,250 L90,400 L170,400 L190,250 L200,230 L210,250 L230,400 L310,400 L300,250 L290,80 L270,80 
    L270,100 L200,115 L130,100 Z" 
    fill="${c.jeans}" stroke="${c.accent}" stroke-width="1.5"/>
  <!-- Waistband -->
  <rect x="110" y="75" width="180" height="25" rx="3" fill="${c.jeans}" stroke="${c.accent}" stroke-width="1"/>
  <!-- Center seam -->
  <line x1="200" y1="100" x2="200" y2="230" stroke="${c.accent}" stroke-width="0.8" opacity="0.4"/>
  <!-- Left leg seam -->
  <line x1="140" y1="250" x2="135" y2="400" stroke="${c.accent}" stroke-width="0.5" opacity="0.3"/>
  <!-- Right leg seam -->
  <line x1="260" y1="250" x2="265" y2="400" stroke="${c.accent}" stroke-width="0.5" opacity="0.3"/>
  <!-- Pocket outlines -->
  <path d="M135,100 L135,145 L175,145 L180,100" fill="none" stroke="${c.accent}" stroke-width="0.8" opacity="0.4"/>
  <path d="M265,100 L265,145 L225,145 L220,100" fill="none" stroke="${c.accent}" stroke-width="0.8" opacity="0.4"/>
  <!-- Rivet dots -->
  <circle cx="138" cy="102" r="2.5" fill="${c.accent}" opacity="0.5"/>
  <circle cx="262" cy="102" r="2.5" fill="${c.accent}" opacity="0.5"/>
  <!-- Brand -->
  <text x="200" y="455" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="300" letter-spacing="3" fill="rgba(255,255,255,0.6)">STYLEHUB</text>
</svg>`)}`;
}

export function getProductImage(product) {
  if (product.category === 'tshirts') {
    return createTShirtSVG(product.name);
  }
  return createJeansSVG(product.name);
}

// Category hero images
export function getCategoryImage(category) {
  if (category === 'tshirts') {
    return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#1a1a1a"/>
  <path d="M320,80 L290,110 L230,90 L215,170 L290,185 L290,330 L510,330 L510,185 L585,170 L570,90 L510,110 L480,80 
    C465,55 435,40 400,40 C365,40 335,55 320,80 Z" 
    fill="#0a0a0a" stroke="#333" stroke-width="2"/>
  <ellipse cx="400" cy="95" rx="50" ry="25" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
  <text x="400" y="375" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="300" letter-spacing="4" fill="rgba(255,255,255,0.5)">T-SHIRTS COLLECTION</text>
</svg>`)}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#2c3e6b"/>
  <path d="M300,40 L275,40 L260,180 L245,340 L355,340 L380,180 L400,150 L420,180 L445,340 L555,340 L540,180 L525,40 L500,40 
    L500,65 L400,85 L300,65 Z" 
    fill="#1f305a" stroke="#4a6fa5" stroke-width="2"/>
  <rect x="275" y="35" width="250" height="30" rx="3" fill="#1f305a" stroke="#4a6fa5" stroke-width="1"/>
  <text x="400" y="375" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="300" letter-spacing="4" fill="rgba(255,255,255,0.5)">JEANS COLLECTION</text>
</svg>`)}`;
}
